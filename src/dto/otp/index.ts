import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOtpDto {
  userId?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  channel: OtpChannelType;

  @ApiProperty()
  phone?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'This is optional if you the channel is set to SMS',
  })
  diaCode?: string;

  @ApiProperty()
  email?: string;
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
  userId?: string;

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
  CHECKED_IN = 'CHECKED_IN',
  CHECKED_OUT = 'CHECKED_OUT',
  INACTIVE = 'INACTIVE',
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

export enum ActionTypeParams {
  VERIFY = 'VERIFY',
  CHECK_OUT = 'CHECK_OUT',
  CHECKED_IN = 'CHECK_IN',
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
