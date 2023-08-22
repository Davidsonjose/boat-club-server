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
