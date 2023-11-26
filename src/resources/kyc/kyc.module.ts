import { Module, forwardRef } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from 'src/services/database/database.service';
import { kycService } from './kyc.service';
import { KycController } from './kyc.controller';

@Module({
  imports: [
    ConfigModule,
    // forwardRef(() => ActivityModule),
    // forwardRef(() => TwilioModule),
    forwardRef(() => UserModule),
  ],
  providers: [kycService, DatabaseService],
  controllers: [KycController],
  exports: [kycService],
})
export class KycModule {}
