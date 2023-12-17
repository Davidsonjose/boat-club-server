import { Injectable } from '@nestjs/common';
import { SystemSpecSdk } from './Systemspec.controller';
import { SpecDataPlansExternal } from './dto';

@Injectable()
export class SystemSpecService {
  constructor(private systemSpec: SystemSpecSdk) {}

  async getDataPlans(billerId: number): Promise<SpecDataPlansExternal[]> {
    try {
      const info = await this.systemSpec.getDataPlans(billerId);
      console.log(info.plans);
      return info.plans;
      //   return txnFee;
    } catch (error) {
      throw new Error(error?.response?.message);
    }
  }
}
