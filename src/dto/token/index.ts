import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InviteStatus } from '@prisma/client';
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
  // @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  fullName: string;

  @ApiPropertyOptional()
  purposeOfVisit: string;

  @ApiPropertyOptional()
  now: boolean;
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
  @ApiProperty({
    enum: InviteStatus,
    type: InviteStatus,
    enumName: 'Visit Status',
  })
  status: InviteStatus;

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

export class VisitDetails {
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

export class CreateVisitEventDto {
  @ApiProperty()
  @IsNotEmpty()
  eventType: string;

  @ApiProperty()
  @IsNotEmpty()
  expectedGuest: string;

  @ApiProperty()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  startFrom: Date;

  @ApiProperty()
  @IsNotEmpty()
  endAt: Date;

  @ApiProperty()
  @IsNotEmpty()
  description: string;
}
export class UserVisitPayload {
  @ApiProperty()
  message: 'Otp Sent Successfully';

  @ApiProperty()
  payload: VisitDetails;

  @ApiProperty()
  nHbits: 1;
}
