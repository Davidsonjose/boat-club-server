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
}

export class RefreshTokenPayload {
  @ApiProperty()
  message: string;
  @ApiProperty()
  payload: RefreshTokenDto;

  @ApiProperty()
  nHbits: 1;
}
