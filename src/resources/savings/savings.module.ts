import { Module, forwardRef } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from 'src/services/database/database.service';
import { ContributionService } from '../contribution/contribution.service';
import { SavingsService } from './savings.service';
import { SavingsController } from './savings.controller';

@Module({
  imports: [
    ConfigModule,
    // forwardRef(() => ActivityModule),
    // forwardRef(() => TwilioModule),
    forwardRef(() => UserModule),
  ],
  providers: [DatabaseService, SavingsService, ContributionService],
  controllers: [SavingsController],
  exports: [],
})
export class SavingsModule {}
