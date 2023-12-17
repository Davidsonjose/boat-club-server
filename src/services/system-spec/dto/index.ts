export class BanicoopDetailsExternal {
  requestChannelId: string;
  requestChannel: string;
  requestChannelType: string;
  requestPartnerCode: string;
  walletId: number;
  transactionPin: string;
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

export class SpecDataPlansExternal {
  code: string;
  description: string;
  amount: string;
  duration: string;
}
