import { Module, forwardRef } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from 'src/services/database/database.service';
import { PinService } from './pin.service';
import { PinController } from './pin.controller';
import { ActivityModule } from '../activity/activity.module';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [
    ConfigModule,
    // forwardRef(() => ActivityModule),
    // forwardRef(() => TwilioModule),
    forwardRef(() => UserModule),
    ActivityModule,
    WalletModule,
  ],
  providers: [PinService, DatabaseService],
  controllers: [PinController],
  exports: [PinService],
})
export class PinModule {}
