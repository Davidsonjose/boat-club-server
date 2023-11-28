import { Module, forwardRef } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from 'src/services/database/database.service';
import { LoanController } from './loan.controller';
import { LoanService } from './loan.service';
import { ContributionService } from '../contribution/contribution.service';

@Module({
  imports: [
    ConfigModule,
    // forwardRef(() => ActivityModule),
    // forwardRef(() => TwilioModule),
    forwardRef(() => UserModule),
  ],
  providers: [DatabaseService, LoanService, ContributionService],
  controllers: [LoanController],
  exports: [],
})
export class LoanModule {}
