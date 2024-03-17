import { Injectable } from '@nestjs/common';
import { SystemSpecSdk } from './Systemspec.controller';
import { SpecDataPlansExternal } from './dto';

@Injectable()
export class SystemSpecService {
  constructor(private systemSpec: SystemSpecSdk) {}

  async getDataPlans(billerId: number): Promise<SpecDataPlansExternal[]> {
    try {
      const info = await this.systemSpec.getDataPlans(billerId);
      return info;
      //   return txnFee;
    } catch (error) {
      throw new Error(error?.response?.message);
    }
  }
  async getDataProviders(): Promise<SpecDataPlansExternal[]> {
    try {
      const info = await this.systemSpec.getDataProviders();
      // console.log(info);
      return info.billers;
      //   return txnFee;
    } catch (error) {
      throw new Error(error?.response?.message);
    }
  }
  async getAirtimeProviders(): Promise<SpecDataPlansExternal[]> {
    try {
      const info = await this.systemSpec.getAirtimeProviders();
      // console.log(info);
      return info.billers;
      //   return txnFee;
    } catch (error) {
      throw new Error(error?.response?.message);
    }
  }
}
