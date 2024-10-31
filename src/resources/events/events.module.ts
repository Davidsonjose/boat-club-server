import { Module, forwardRef } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from 'src/services/database/database.service';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';

@Module({
  imports: [
    ConfigModule,
    // forwardRef(() => ActivityModule),
    // forwardRef(() => TwilioModule),
    forwardRef(() => UserModule),
  ],
  providers: [EventsService, DatabaseService],
  controllers: [EventsController],
  exports: [EventsService],
})
export class EventModule {}
