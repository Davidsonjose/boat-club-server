import { Module } from '@nestjs/common';
import { BroadcastService } from './broadcast.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BroadcastMessage } from './broadcast.entity';
import { User } from '../auth/user.entity';
import { BroadcastController } from './broadcast.controller';

@Module({
  providers: [BroadcastService],
  imports: [TypeOrmModule.forFeature([BroadcastMessage, User])],
  exports: [BroadcastService],
  controllers: [BroadcastController],
})
export class BroadcastModule {}
