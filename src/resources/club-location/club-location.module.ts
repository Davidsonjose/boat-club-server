import { Module, forwardRef } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from 'src/services/database/database.service';
import { ClubLocationService } from './club-location.service';
import { ClubLocationController } from './club-location.controller';

@Module({
  imports: [ConfigModule, forwardRef(() => UserModule)],
  providers: [ClubLocationService, DatabaseService],
  controllers: [ClubLocationController],
  exports: [ClubLocationService],
})
export class ClubLocationModule {}
