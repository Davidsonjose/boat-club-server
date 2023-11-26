import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContributionUserMonth, Transaction } from '@prisma/client';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateContributionDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Contribution name is required' })
  contributionName: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Monthly amount is required' })
  monthlyAmount: number;

  @ApiProperty()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty()
  @IsNumber()
  participants: number;

  @ApiProperty()
  @IsNumber()
  totalServer: number;
}

export class JoinContributionParamDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  contributionId: number;
}

export class JoinContributionDto {
  @ApiProperty()
  @IsNotEmpty()
  dayOfRemittance: string;

  @ApiPropertyOptional()
  displayName: string;

  @ApiProperty()
  @IsBoolean()
  useDetails: boolean;

  contributionId: number;
}

export class MakePaymentContributionDto {
  userId: number;

  @ApiProperty()
  monthIdentifier: string;

  @ApiProperty()
  joinContributionId: number;
}

export class MakePaymentResDto {
  transaction: Transaction;
  monthDetails: ContributionUserMonth;
}
