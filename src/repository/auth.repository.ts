import { Injectable, UnauthorizedException } from '@nestjs/common';
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
        pwd: createUserDto.pwd,
        companyId,
        company: singleCompany,
        dateOfBirth,
      });
      await newuser.save();

      settings.user = newuser;
      settings.userId = newuser.id;
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

      this.otpService.sendOtpEmail(email, newuser.id);
      return info;
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getSingleUser(email: string, type?: string): Promise<User> {
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
      throw new UnauthorizedException('Unauthorized access');
    }
    return singleuser;
  }

  async signIn(signInUserDto: SignInUserDto): Promise<LoginPayload> {
    try {
      const { email, pwd } = signInUserDto;
      const user = await this.getSingleUser(email?.toLowerCase());
      const isPasswordValid = await user.comparePassword(pwd);

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
}
