import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

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
  @IsNotEmpty()
  action: VisitorActionTypes;
}

export class VerifyVisitDto {
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty()
  code: string;
}

export class VerifyVisitPayload {
  @ApiProperty({ enum: CodeStatus, type: CodeStatus, enumName: 'Visit Status' })
  status: CodeStatus;

  @ApiProperty()
  code: string;
}

class GuestDataPayload {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  phoneNumber: string;
}
class HostDataPayload {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;
}

class VisitDetails {
  @ApiProperty()
  id: 1;
  @ApiProperty()
  code: string;
  @ApiProperty()
  expiresAt: Date;
  @ApiProperty()
  validFrom: Date;
  @ApiProperty()
  cancelled: false;
  @ApiProperty({ enum: CodeStatus, enumName: 'Code Status' })
  status: CodeStatus;
  @ApiProperty()
  completed: false;
  @ApiProperty()
  host: HostDataPayload;
  @ApiProperty()
  guest: GuestDataPayload;
}

export class UserVisitPayload {
  @ApiProperty()
  message: 'Otp Sent Successfully';

  @ApiProperty()
  payload: VisitDetails;

  @ApiProperty()
  nHbits: 1;
}
