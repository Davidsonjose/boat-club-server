import { Module } from '@nestjs/common';
import { ContributionController } from './contribution.controller';
import { ContributionService } from './contribution.service';
import { DatabaseService } from 'src/services/database/database.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [ContributionController],
  providers: [ContributionService, DatabaseService],
})
export class ContributionModule {}
