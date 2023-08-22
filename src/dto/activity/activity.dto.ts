import { ApiParam, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ActivityUsageData } from '../auth/user.dto';

export enum ActivityEnumType {
  SIGNUP = 'SIGNUP',
  SIGNIN = 'SIGNIN',
  SEND_OTP = 'SEND_OTP',
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
  UPDATE_PIN = 'UPDATE_PIN',
  SETTINGS_UPDATE = 'SETTINGS_UPDATE',
  DELETE_USER = 'DELETE_USER',
  CHANGE_EMAIL = 'CHANGE_EMAIL',
  CHANGE_PHONE = 'CHANGE_PHONE',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
}

export class CreateActivityDto {
  userId?: string;

  // @ApiParam()
  @ApiProperty({ enum: ActivityEnumType, enumName: 'Activity Types' })
  activityType: ActivityEnumType;
}

export class ActivityPayload {
  @ApiProperty()
  activityHash: string;

  @ApiProperty({ enum: ActivityEnumType, enumName: 'Activity Types' })
  activityType: ActivityEnumType;
}

export class VerifyActivityDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsString()
  @IsNotEmpty()
  activityType: ActivityEnumType;

  @IsString()
  @MinLength(10)
  activityHash: string;
}

// SIGNIN
// SIGNUP
// FORGOT_PASSWORD
// CHANGE_EMAIL
// CHANGE_PASSWORD
// CHANGE_PHONE
// UPDATE_PIN
// UPDATE_KYC
// SEND_RECEIVE_TXN
// SWAP_TXN
// SETTINGS_UPDATE
// DELETE_USER

export const activityUsageMap: ActivityUsageData = {
  CHANGE_EMAIL: 2,
  CHANGE_PHONE: 2,
  CHANGE_PASSWORD: 2,
  DELETE_USER: 1,
  FORGOT_PASSWORD: 2,
  SEND_OTP: 1,
  SETTINGS_UPDDATE: 1,
  SIGNIN: 1,
  UPDATE_PIN: 2,
};
