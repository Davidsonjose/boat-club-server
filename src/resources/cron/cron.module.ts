import { Module } from '@nestjs/common';
import { CronController } from './cron.controller';
import { CronService } from './cron.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { Settings } from '../settings/settings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Settings])],
  providers: [CronService],
  controllers: [CronController],
})
export class CronModule {}
