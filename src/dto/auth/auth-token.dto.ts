import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  accessToken?: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  refreshToken: string;

  @ApiProperty()
  @IsNotEmpty()
  companyId: number;
}

export type IRequestState = {
  email: string;
  id: number;
  uid: string;
  firstName: string;
  lastName: string;
  clientIp: string;
  active: boolean;
  updatedAt: Date;
  createdAt: Date;
};

export class AuthRefreshAccessTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  refreshToken: string;
}

export class RefreshTokenPayload {
  @ApiProperty()
  message: string;
  @ApiProperty()
  payload: RefreshTokenDto;

  @ApiProperty()
  nHbits: 1;
}
