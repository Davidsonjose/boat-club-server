import { ApiProperty } from '@nestjs/swagger';

export class CreateSettingDto {
  @ApiProperty()
  defaultCurrencyCode?: string;

  @ApiProperty()
  defaultCurrencySymbol?: string;

  @ApiProperty()
  defaultCurrencyName?: string;
}
