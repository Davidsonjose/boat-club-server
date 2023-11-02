import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from 'src/repository/auth.repository';
import { User } from './user.entity';
import { CreateUserDto, SignInUserDto } from 'src/dto/auth/user.dto';
import { LocationService } from '../location/location.service';
import { RefreshTokenDto } from 'src/dto/auth/auth-token.dto';
import { UserService } from '../user/user.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private locationService: LocationService,
    private userService: UserService,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto, ipAddress: string) {
    const info = await this.locationService.getRequestLocation(ipAddress);
    const createSettingDto = info.settings;
    const createLocationDto = info.userLocation;

    try {
      if (
        !(await this.isEmailUniqueForCompany(
          createUserDto.email,
          createUserDto.companyId,
        ))
      ) {
        throw new ConflictException('Email already exists');
      }

      if (
        !(await this.isPhoneNumberUniqueForCompany(
          createUserDto.phoneNumber,
          createUserDto.companyId,
        ))
      ) {
        throw new ConflictException('Phone number already exists');
      }
      // if (
      //   !(await this.isUsernameUniqueForCompany(
      //     createUserDto.username,
      //     createUserDto.companyId,
      //   ))
      // ) {
      //   throw new ConflictException('Username already exists.');
      // }

      return await this.authRepository.createUser(
        createUserDto,
        createSettingDto,
        createLocationDto,
      );
    } catch (error) {
      if (error.code === '23505' && error.detail.includes('email')) {
        throw new ConflictException('Email is already taken');
      }
      if (error.code === '23505' && error.detail.includes('username')) {
        throw new ConflictException('Username is already taken');
      }
      if (error.code === '23505' && error.detail.includes('phoneNumber')) {
        throw new ConflictException('Phone number is already taken');
      }
      throw error;
    }
  }

  async isEmailUniqueForCompany(
    email: string,
    companyId: number,
  ): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { email, companyId },
    });
    return !user;
  }

  async isPhoneNumberUniqueForCompany(
    phoneNumber: string,
    companyId: number,
  ): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { phoneNumber, companyId },
    });
    return !user;
  }
  async isUsernameUniqueForCompany(
    username: string,
    companyId: number,
  ): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { username, companyId },
    });
    return !user;
  }

  //
  async getAllUser(): Promise<User[]> {
    return this.authRepository.getAllUsers();
  }

  async signIn(signInUserDto: SignInUserDto) {
    try {
      return this.authRepository.signIn(signInUserDto);
    } catch (error) {
      throw error;
    }
  }

  async refreshUserToken(
    userId: string,
    refreshTokenDto: RefreshTokenDto,
  ): Promise<RefreshTokenDto> {
    const user = await this.userService.getSingleUser(
      userId,
      'auth',
      refreshTokenDto.companyId,
    );
    if (!user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return this.authRepository.generateRefreshToken(user, refreshTokenDto);
  }
}
