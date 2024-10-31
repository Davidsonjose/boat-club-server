import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CreateSettingDto } from '../settings/settings.dto';
import { OtpChannelType } from '../otp';
import { User } from '@prisma/client';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  SUPER_ADMIN = 'super_admin',
}

export enum ActivityUsageEnum {
  ONE_AUTHENTICATION = 0,
  TWO_AUTHENTICATION = 1,
}

export enum RequestTypeEnum {
  AUTH = 'auth',
  DEFAULT = 'default',
}

export class CreateUserLocationDto {
  @ApiProperty()
  ipAddress: string;

  @ApiProperty()
  latitude: string;

  @ApiProperty()
  longtitude: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  countryCode: string;

  @ApiProperty()
  continent: string;

  @ApiProperty()
  timezone: string;

  @ApiProperty()
  isEu: boolean;
}

export class EmailVerifiedDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}

export class UpdateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(30)
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(30)
  lastName: string;
}

export class CreateUserDto {
  // @ApiProperty()
  // @IsString()
  // @MinLength(4)
  // @MaxLength(20)
  // username: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @IsPhoneNumber(undefined, { message: 'Invalid phone number format' })
  phoneNumber: string;

  @IsString()
  @ApiProperty()
  dialCode: string;

  @IsOptional()
  @ApiProperty()
  dateOfBirth: Date;

  @ApiProperty()
  referralCode?: string;

  //   @IsString()
  pin?: string;

  @ApiProperty()
  profileImageUrl?: string;

  @ApiProperty()
  @IsString()
  memberId: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  @ApiProperty()
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).*$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  pwd: string;
}

export class SignInUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  pwd: string;
}

export class LoginPayload {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  user: UserPayloadData;

  @ApiProperty()
  activityHash: string;
}

export class userdata {
  @ApiProperty()
  countryCode: string;

  @ApiProperty()
  dialCode: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  hasPin: boolean;

  @ApiProperty()
  fiatCurrencySymbol: string;

  @ApiProperty()
  message?: string;
}

export class SignInPayload {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  user: userdata;
}

export class UserPayloadData {
  @ApiProperty()
  countryCode: string;

  @ApiProperty()
  dialCode: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  hasPin: boolean;

  @ApiProperty()
  fiatCurrencySymbol: string;

  @ApiProperty()
  message?: string;

  @ApiProperty()
  location?: CreateUserLocationDto;

  @ApiProperty()
  settings?: CreateSettingDto;

  @ApiProperty()
  emailVerified: boolean;
}

export class GetUserDataPayload {}

export class SignUpPaylod {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  user: UserPayloadData;
}

export class UpdatePinDto {
  user?: User;

  @ApiProperty()
  pin: string;

  @ApiProperty()
  activityHash: string;
}
export class UpdatePinPayload {
  @ApiProperty()
  pin: string;

  @ApiProperty()
  activityHash: string;
}

export interface VerifyActivityUsage {
  activityHash: string;
  userId: number;
  activityUsage: ActivityUsageEnum;
}

export class VerifyPinDto {
  @ApiProperty()
  activityHash?: string;

  @ApiProperty()
  pin: string;
}

export class UpdatePasswordDto {
  @ApiProperty()
  activityHash: string;

  @ApiProperty()
  pwd: string;
}

export class UpdateProfileDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  profileImageUrl: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  allowPushNotification: boolean;
}

export class UpdatePhoneDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  dialCode: string;

  @IsNotEmpty()
  activityHash: string;
}

export class UpdateEmailDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  activityHash: string;
}

export class ForgotPasswordVerificationDto {
  @IsNotEmpty()
  @ApiProperty({ enum: OtpChannelType, enumName: 'Token Channel' })
  channel: OtpChannelType;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;
}

export class ForgotPasswordUpdateDto {
  @ApiProperty()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @IsNotEmpty()
  pwd: string;

  @ApiProperty()
  @IsNotEmpty()
  activityHash: string;
}
export interface ActivityUsageData {
  CHANGE_EMAIL: number;
  CHANGE_PASSWORD: number;
  CHANGE_PHONE: number;
  DELETE_USER: number;
  FORGOT_PASSWORD: number;
  SEND_OTP: number;
  SETTINGS_UPDDATE: number;
  SIGNIN: number;
  UPDATE_PIN: number;
  SIGNUP: number;
}
export class ForgotVerifyPayload {
  @ApiProperty()
  message: string;

  @ApiProperty()
  foundUser: boolean;

  @ApiProperty()
  activityHash: string | null;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

export class GetUserDto {
  id: number;
  uid: string;
  email: string;
  firstName: string;
  phoneNumber: string;
  dialCode: string;
  lastName: string;
  clientIp: string;
  active: false;
  updatedAt: Date;
  createdAt: Date;
  iat: number;
  exp: number;
}

export class UpdatePushToken {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  deviceToken: string;
}

export class CreateGoalBasedLoanDto {
  // @ApiProperty()
  // @IsOptional()
  // @IsDate()
  // targetDate?: Date;

  @ApiProperty()
  @IsNotEmpty()
  // @IsDate()
  startDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  // @IsDate()
  endDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  // @ApiProperty()
  // @IsOptional()
  // @IsDate()
  // paydayDueDate?: Date;

  @ApiProperty()
  @IsOptional()
  documents?: string;
}
export class CreatePayDayLoanDto {
  // @ApiProperty()
  // @IsOptional()
  // @IsDate()
  // targetDate?: Date;

  @ApiProperty()
  @IsNotEmpty()
  // @IsDate()
  startDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  // @IsDate()
  endDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  // @ApiProperty()
  // @IsOptional()
  // @IsDate()
  // paydayDueDate?: Date;

  @ApiProperty()
  @IsOptional()
  documents?: string;
}
