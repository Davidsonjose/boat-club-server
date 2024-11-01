import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateOtpDto {
  user?: User;

  @ApiPropertyOptional()
  activityHash: string;
}

export enum OtpChannelType {
  SMS = 'SMS',
  EMAIL = 'EMAIL',
}

export class OtpDataPayload {
  @ApiProperty()
  message: 'Otp Sent Successfully';

  @ApiProperty()
  payload: [];

  @ApiProperty()
  nHbits: 1;
}

export class VerifyOtpDto {
  userId?: number;

  @ApiProperty()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({ enum: OtpChannelType, enumName: 'Otp Channel Type' })
  @IsNotEmpty()
  channel: OtpChannelType;

  @ApiProperty()
  phone?: string;

  @ApiProperty()
  diaCode?: string;

  @ApiProperty()
  email?: any;

  @ApiProperty()
  activityHash?: string;

  @ApiPropertyOptional()
  verifyEmail?: boolean;
}

export class VerifyEmailOtpDto {
  @ApiProperty()
  @IsNotEmpty()
  otp: string;

  @IsOptional()
  @ApiProperty()
  verifyEmail?: boolean;

  @ApiPropertyOptional()
  activityHash?: string;
}

export class VerifySmsOtpDto {
  @ApiProperty()
  @IsNotEmpty()
  otp: string;

  @IsOptional()
  @ApiProperty()
  verifyPhoneNumber?: boolean;

  @ApiPropertyOptional()
  activityHash?: string;
}
export class VerifyForgotOtpDto {
  @ApiProperty()
  @IsNotEmpty()
  userId?: number;

  @ApiProperty()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({ enum: OtpChannelType, enumName: 'Otp Channel Type' })
  @IsNotEmpty()
  channel: OtpChannelType;

  @ApiProperty()
  phone?: string;

  @ApiProperty()
  diaCode?: string;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  activityHash?: string;
}

export enum CodeStatus {
  DEFAULT = 'DEFAULT',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum InviteStatus {
  INACTIVE = 'INACTIVE',
  CHECKED_IN = 'CHECKED_IN',
  CHECKED_OUT = 'CHECKED_OUT',
}

export class CodeReturns {
  @ApiProperty({ enum: CodeStatus, enumName: 'CodeStatus' })
  status: CodeStatus;

  @ApiProperty()
  expiresAt: Date;
}
export class CodeActionPaylod {
  @ApiProperty()
  message: 'Completed successfully';

  @ApiProperty()
  payload: CodeReturns;

  @ApiProperty()
  nHbits: 1;
}

export class ForgotVerifyReturn {
  @ApiProperty()
  message: 'You get a verification code to reset your password if your email is valid';

  @ApiProperty()
  foundUser: boolean;

  @ApiProperty()
  activityHash: string;

  @ApiProperty()
  userId: string;
}
export class ForgotPasswordVerifyPayload {
  @ApiProperty()
  message: 'Successfull';

  @ApiProperty()
  payload: ForgotVerifyReturn;

  @ApiProperty()
  nHbits: 1;
}

export enum ActionTypeParams {
  VERIFY = 'VERIFY',
  CHECK_OUT = 'CHECK_OUT',
  CHECK_IN = 'CHECK_IN',
}
export class MakeActionDto {
  // @ApiParam()
  @ApiProperty({ enum: ActionTypeParams, enumName: 'Action Types' })
  activityType: ActionTypeParams;

  @ApiProperty({ enum: CodeStatus, enumName: 'CodeStatus' })
  status: CodeStatus;
}

// export class MakeActionData {
//   @ApiProperty()
//   scheme: string;

// }

export enum OtpEmailTypeEnum {
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  SIGNUP = 'SIGNUP',
  VERIFY_EMAIL = 'VERIFY_EMAIL',
}

export interface CreateGuest {
  fullName: string;
  phoneNumber: string;
}

// export {
//   visitorId: 2,
//   code: 123434,
//   expiresAt: 2022,
//   validFrom: 2021
//   host: {
//     name: "davidson",
//     id: 1
//   },
//   guest: {
//     fullName: visitor.fullName,
//     id: visitor.id,
//     phoneNumber: visitor.phoneNumber,
//   }
// }
