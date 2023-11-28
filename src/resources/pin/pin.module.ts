import { Module, forwardRef } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from 'src/services/database/database.service';
import { PinService } from './pin.service';
import { PinController } from './pin.controller';
import { ActivityModule } from '../activity/activity.module';
import { WalletModule } from '../wallet/wallet.module';
import { kycService } from '../kyc/kyc.service';
import { LoanService } from '../loan/loan.service';
import { SavingsService } from '../savings/savings.service';
import { ContributionService } from '../contribution/contribution.service';

@Module({
  imports: [
    ConfigModule,
    // forwardRef(() => ActivityModule),
    // forwardRef(() => TwilioModule),
    forwardRef(() => UserModule),
    ActivityModule,
    WalletModule,
  ],
  providers: [
    PinService,
    DatabaseService,
    kycService,
    LoanService,
    SavingsService,
    ContributionService,
  ],
  controllers: [PinController],
  exports: [PinService],
})
export class PinModule {}
