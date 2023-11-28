import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '..';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum SavingTransactionEnum {
  SPEND_AND_SAVE = 'spend_and_save',
  FIXED_SAVING = 'fixed_saving',
  TARGET_SAVING = 'target_saving',
}
export class FilterSavingsTransactionsDto extends PaginationDto {
  @ApiPropertyOptional({
    enum: SavingTransactionEnum,
    enumName: 'Savings Type',
  })
  savingType: SavingTransactionEnum;
}

export class GetTargetSavingDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  targetSavingId: number;
}
export class GetSpendAndSaveDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  spendAndSaveId: number;
}
export class GetFixedSavingDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  fixedSavingId: number;
}

export class CreateFixedSavingDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Start amount is required' })
  amount: number;

  @ApiProperty()
  @IsDate({ message: 'Start date must be a valid date' })
  startDate: Date;

  @ApiProperty()
  @IsDate({ message: 'End date must be a valid date' })
  endDate?: Date;

  @ApiPropertyOptional()
  title: string;
}

export class CreateSpendAndSaveDto {
  @IsNotEmpty({ message: 'Percentage is required' })
  @IsString({ message: 'Percentage must be a string' })
  percentage: string;
}

export enum PaymentFrequencyEnum {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export class CreateTargetSavingsDto {
  @ApiProperty({ enum: PaymentFrequencyEnum, enumName: 'Payment Frequency' })
  paymentFrequency: PaymentFrequencyEnum;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  targetAmount: string;

  @ApiProperty()
  title: string;
}
