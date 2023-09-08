import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Events } from './events.entity';
import { PassportModule } from '@nestjs/passport';
import { EventService } from './event.service';
import { EventsController } from './event.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Events]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [EventService],
  controllers: [EventsController],
  exports: [EventService],
})
export class EventsModule {}
