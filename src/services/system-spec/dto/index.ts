import { ApiProperty } from '@nestjs/swagger';

export class BanicoopDetailsExternal {
  requestChannelId: string;
  requestChannel: string;
  requestChannelType: string;
  requestPartnerCode: string;
  walletId: number;
  transactionPin: string;
  requestApplicationCode: string;
  //   customerId: string;
}

export class AirtimeTopUpExternal {
  billerName: string;
  billerId: number;
  paymentAmount: number;
  paymentWithBonus?: boolean;
  currency: string;
  customerId: string;
  saveBeneficiary?: boolean;
  //   saveBe
  //   bonusAmo
}

export enum AxiosRequestMethodEnum {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export class LoginExternalSystemSpecPayload {
  accessToken: string;
  refreshToken: string;
}

export class LoginExternalDto {
  username: string;
  password: string;
}

export class CurrencyDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  symbol: string;
}

export class SpecDataPlansExternal {
  @ApiProperty()
  billerId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  maximumPurchasedAllowed: string;

  @ApiProperty()
  minimumPurchasedAllowedAmount: string;

  @ApiProperty()
  currency: CurrencyDto;
}

export class SpecDataProvidersExternal {
  @ApiProperty()
  billerId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  maximumPurchasedAllowed: string;

  @ApiProperty()
  minimumPurchasedAllowedAmount: string;
}
