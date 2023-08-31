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
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  CHECKED_IN = 'CHECKED_IN',
  CHECKED_OUT = 'CHECKED_OUT',
}

export enum VisitorActionTypes {
  VERIFY = 'VERIFY',
  CHECK_IN = 'CHECK_IN',
  CHECK_OUT = 'CHECK_OUT',
}

export class VerifyActionParam {
  @ApiProperty({ enum: VisitorActionTypes })
  action: VisitorActionTypes;
}

export class VerifyVisitDto {
  @ApiProperty()
  code: string;
}

export class VerifyVisitPayload {
  @ApiProperty({ enum: CodeStatus, type: CodeStatus, enumName: 'Visit Status' })
  status: CodeStatus;

  @ApiProperty()
  code: string;
}
