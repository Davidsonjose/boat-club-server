import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PaginationDto {
  @ApiProperty()
  @IsOptional()
  skipResults?: number;

  @ApiProperty()
  @IsOptional()
  takeResultAmount?: number;
}
