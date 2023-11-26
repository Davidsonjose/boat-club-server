import { ApiProperty } from '@nestjs/swagger';

export class KycOneDto {
  @ApiProperty()
  phoneNumber: string;

  userId: number;
}

export class KycTwoDto {
  @ApiProperty()
  address: string;
  @ApiProperty()
  faceVerificationUrl: string;

  userId: number;
}

export class KycThreeDto {
  userId: number;

  @ApiProperty()
  bvn: string;
}

export enum kycLevelEnum {
  TIER_ONE = 'tier_one',
  TIER_TWO = 'tier_two',
  TIER_THREE = 'tier_three',
}
