import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenDto } from 'src/dto/auth/auth-token.dto';
import {
  CreateUserLocationDto,
  CreateUserDto,
  UserRole,
  SignInUserDto,
  LoginPayload,
  UserPayloadData,
} from 'src/dto/auth/user.dto';
import { CreateSettingDto } from 'src/dto/settings/settings.dto';
import { RefreshToken } from 'src/resources/auth/refreshToken.entity';
import { User } from 'src/resources/auth/user.entity';
import { LocationService } from 'src/resources/location/location.service';
import { SettingsService } from 'src/resources/settings/settings.service';
import { Repository } from 'typeorm';
import { addDays } from 'date-fns';
import { CompanyService } from 'src/resources/company/company.service';
import { ActivityService } from 'src/resources/activity/activity.service';
import { ActivityEnumType } from 'src/dto/activity/activity.dto';
import { OtpService } from 'src/resources/otp/otp.service';
import * as bcrypt from 'bcrypt';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { RabbitMQService } from 'src/services/rabbitMQ/rabbitmq.service';
import {
  AMQPEventType,
  AdminTypeEmum,
  EventPatternEnum,
} from 'src/services/rabbitMQ/interface';
@Injectable()
export class AuthRepository {
  constructor(
    private jwtService: JwtService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private settingsService: SettingsService,
    private locationService: LocationService,

    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private companyService: CompanyService,
    private activityService: ActivityService,
    private otpService: OtpService,

    private rabbitMQService: RabbitMQService,
  ) {}
  async createUser(
    createUserDto: CreateUserDto,
    createSettingDto: CreateSettingDto,
    createUserLocationDto: CreateUserLocationDto,
  ) {
    try {
      const {
        username,
        firstName,
        lastName,
        email,
        phoneNumber,
        dialCode,
        referralCode,
        profileImageUrl,
        companyId,
        dateOfBirth,
      } = createUserDto;

      const settings = await this.settingsService.createUserSettings(
        createSettingDto,
      );
      const location = await this.locationService.createUserLocation(
        createUserLocationDto,
      );
      const singleCompany = await this.companyService.getSingleCompany(
        companyId,
      );
      //
      const pass = await this.hashUserPassword(createUserDto.pwd);
      const newuser = this.userRepository.create({
        username: username?.toLowerCase(),
        firstName,
        lastName,
        email: email?.toLowerCase(),
        phoneNumber,
        dialCode,
        profileImageUrl,
        pin: createUserDto.pin,
        referralCode,
        settings: settings,
        location: location,
        country: location.country,
        pwd: pass,
        companyId,
        company: singleCompany,
        dateOfBirth,
      });

      await newuser.save();

      settings.user = newuser;
      settings.userId = newuser.id;
      settings.companyId = newuser.companyId;
      location.user = newuser;
      location.userId = newuser.id;
      await settings.save();
      await location.save();

      const { pin, pwd, hash, ...others } = newuser;

      const tokens = await this.generateAccessAndRefresh(newuser);

      const activityHash = await this.generateAuthActivityHash(
        newuser,
        ActivityEnumType.SIGNUP,
      );
      const info = {
        ...tokens,
        activityHash: activityHash,
        user: others,
      };

      await this.handleNewUserMQ(newuser);
      this.otpService.sendOtpEmail(newuser, ActivityEnumType.SIGNUP);
      return info;
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getSingleUser(
    email: string,
    type?: string,
    handler?: boolean,
  ): Promise<User> {
    if (type == 'auth') {
      let singleuser = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.location', 'location')
        .leftJoinAndSelect('user.settings', 'settings')
        .where('user.id = :email', { email })
        .getOne();
      return singleuser;
    }

    let singleuser = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.location', 'location')
      .leftJoinAndSelect('user.settings', 'settings')
      .where('user.email = :email', { email })
      .getOne();

    if (!singleuser) {
      if (handler) {
        throw new BadRequestException('Incorrect Credentials');
      } else {
        throw new UnauthorizedException('Unauthorized access');
      }
    }
    return singleuser;
  }

  async signIn(signInUserDto: SignInUserDto): Promise<LoginPayload> {
    try {
      const { email, pwd } = signInUserDto;
      const user = await this.getSingleUser(email?.toLowerCase(), '', true);
      const isPasswordValid = await user.comparePassword(pwd);

      if (user.approved == false) {
        throw new BadRequestException(
          `Hi ${user?.username}, Your account is under review. You will get a mail once you have been approved.`,
        );
      }
      if (!isPasswordValid) {
        throw new UnauthorizedException(`Incorrect Credentials`);
      }
      const tokens = await this.generateAccessAndRefresh(user);
      const userdetails = this.userModifiedData(user);

      const activityHash = await this.generateAuthActivityHash(
        user,
        ActivityEnumType.SIGNIN,
      );
      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        activityHash,
        user: { message: `Welcome ${user?.username} 👋`, ...userdetails },
      };
    } catch (error) {
      throw error;
    }
  }

  async generateAccessToken(user: User): Promise<string> {
    const payload = { sub: user.id };
    return this.jwtService.sign(payload, { expiresIn: '20m' });
  }

  async generateRefreshToken(
    user: User,
    refreshTokenDto: RefreshTokenDto,
  ): Promise<RefreshTokenDto> {
    await this.validate(refreshTokenDto.refreshToken, user.id);
    const payload = { sub: user.id };
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '1d' });

    const newAccessToken = await this.generateAccessToken(user);

    await this.invalidateRefreshToken(user.id);
    const newRefreshToken = new RefreshToken();
    newRefreshToken.userId = user.id;
    newRefreshToken.token = refreshToken;
    newRefreshToken.expirationDate = addDays(new Date(), 1);
    await this.refreshTokenRepository.save(newRefreshToken);

    return { accessToken: newAccessToken, refreshToken };
  }

  private async invalidateRefreshToken(userId: string) {
    await this.refreshTokenRepository.delete({ userId });
  }

  private async saveRefreshToken(userId: string, refreshToken: string) {
    const newRefreshToken = new RefreshToken();
    newRefreshToken.userId = userId;
    newRefreshToken.token = refreshToken;
    await this.refreshTokenRepository.save(newRefreshToken);
  }

  async getRefreshToken(user: User): Promise<string> {
    const payload = { sub: user.id };
    await this.invalidateRefreshToken(user.id);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '1d' });

    const newRefreshToken = new RefreshToken();
    newRefreshToken.userId = user.id;
    newRefreshToken.token = refreshToken;
    newRefreshToken.expirationDate = addDays(new Date(), 1);
    await this.refreshTokenRepository.save(newRefreshToken);

    return refreshToken;
  }

  async validate(refreshToken: string, userId: string): Promise<any> {
    const token = refreshToken;
    const newRefreshToken = await this.refreshTokenRepository.findOne({
      where: { userId: userId, token: refreshToken },
    });

    if (!newRefreshToken || newRefreshToken.expirationDate < new Date()) {
      throw new UnauthorizedException();
    }
    return;
  }

  userModifiedData(user: User): UserPayloadData {
    const userPayload: UserPayloadData = {
      id: user?.id,
      email: user?.email,
      firstName: user?.firstName,
      lastName: user?.lastName,
      dialCode: user?.dialCode,
      phone: user?.phoneNumber,
      hasPin: user?.hasPin,
      countryCode: user?.location?.countryCode,
      fiatCurrencySymbol: user?.settings?.defaultCurrencySymbol,
      message: `Welcome ${user?.username} 👋`,
      emailVerified: user.emailVerified,
    };

    return userPayload;
  }

  async generateAccessAndRefresh(user: User): Promise<RefreshTokenDto> {
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.getRefreshToken(user);

    return { accessToken, refreshToken };
  }

  async generateAuthActivityHash(
    user: User,
    activityType: ActivityEnumType,
  ): Promise<string> {
    const activityDto = {
      userId: user.id,
      activityType,
    };
    const activityHash = await this.activityService.intiateActivity(
      activityDto,
      user,
    );

    return activityHash.activityHash;
  }

  async hashUserPassword(pwd: string): Promise<string> {
    const salt = await bcrypt.genSalt();

    const pass = await bcrypt.hash(pwd, salt);
    return pass;
  }

  async handleNewUserMQ(user: User) {
    try {
      const { firstName, lastName, companyId, id } = user;
      this.rabbitMQService.emit({
        ...RabbitMQService.generateEventPayloadMetaData({
          user: {
            firstName,
            lastName,
            companyId,
            userId: id,
          },
          ipAddress: '',
        }),
        eventSource: AdminTypeEmum.ADMIN,
        eventType: AMQPEventType.PUSH,
        eventPattern: EventPatternEnum.USER_REGISTERED,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
