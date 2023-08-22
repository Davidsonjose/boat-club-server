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

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private locationService: LocationService,
    private userService: UserService,
  ) {}

  async createUser(createUserDto: CreateUserDto, ipAddress: string) {
    const info = await this.locationService.getRequestLocation(ipAddress);
    const createSettingDto = info.settings;
    const createLocationDto = info.userLocation;

    try {
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

  async getAllUser(): Promise<User[]> {
    return this.authRepository.getAllUsers();
  }

  async signIn(signInUserDto: SignInUserDto) {
    const { email } = signInUserDto;

    // const user = await this.authRepository.getSingleUser(email);
    // if (!user) {
    //   throw new UnauthorizedException('Invalid Credentials');
    // }
    return this.authRepository.signIn(signInUserDto);
  }

  async refreshUserToken(
    userId: string,
    refreshTokenDto: RefreshTokenDto,
  ): Promise<RefreshTokenDto> {
    const user = await this.userService.getSingleUser(userId, 'auth');
    if (!user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return this.authRepository.generateRefreshToken(user, refreshTokenDto);
  }
}
