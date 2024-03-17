import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/services/database/database.service';
import { UserService } from '../user/user.service';
import { SystemSpecService } from 'src/services/system-spec/Systemspec.service';
import { SpecDataPlansExternal } from 'src/services/system-spec/dto';

@Injectable()
export class BillService {
  constructor(
    private databaseService: DatabaseService,
    private userService: UserService,
    private systemSpecService: SystemSpecService,
  ) {}

  async getDataPlans(billerId: number): Promise<any> {
    try {
      return await this.systemSpecService.getDataPlans(billerId);
    } catch (error) {
      throw error;
    }
  }
  async getAirtimeProviders(): Promise<SpecDataPlansExternal[]> {
    try {
      return await this.systemSpecService.getAirtimeProviders();
    } catch (error) {
      throw error;
    }
  }

  async getDataProviders(): Promise<any> {
    try {
      return await this.systemSpecService.getDataProviders();
    } catch (error) {
      throw error;
    }
  }
}
