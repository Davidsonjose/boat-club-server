import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/services/database/database.service';
import { ConfigModule } from '@nestjs/config';
import { BillService } from './bills.service';
import { BillController } from './bills.controller';
import { UserModule } from '../user/user.module';
import { SystemSpecModule } from 'src/services/system-spec/systemSpec.module';

@Module({
  imports: [ConfigModule, UserModule, SystemSpecModule],
  controllers: [BillController],
  providers: [BillService, DatabaseService],
})
export class BillModule {}
