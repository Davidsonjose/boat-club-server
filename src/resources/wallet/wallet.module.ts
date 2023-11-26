import { Module, forwardRef } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { DatabaseService } from 'src/services/database/database.service';

@Module({
  imports: [
    ConfigModule,
    // forwardRef(() => ActivityModule),
    // forwardRef(() => TwilioModule),
    forwardRef(() => UserModule),
  ],
  providers: [WalletService, DatabaseService],
  controllers: [WalletController],
  exports: [WalletService],
})
export class WalletModule {}
