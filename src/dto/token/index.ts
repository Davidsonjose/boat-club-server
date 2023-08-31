import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  validFrom: Date;

  @ApiProperty()
  @IsNotEmpty()
  expiresAt: Date;

  @ApiProperty()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  oneTime: boolean;

  @ApiProperty()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  fullName: string;

  @ApiPropertyOptional()
  purposeOfVisit: string;
}

export enum CodeStatus {
  INACTIVE = 'INACTIVE',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}
