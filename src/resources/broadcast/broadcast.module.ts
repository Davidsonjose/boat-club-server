import { Module } from '@nestjs/common';
import { BroadcastService } from './broadcast.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BroadcastMessage } from './broadcast.entity';
import { User } from '../auth/user.entity';

@Module({
  providers: [BroadcastService],
  imports: [TypeOrmModule.forFeature([BroadcastMessage, User])],
  exports: [BroadcastService],
})
export class BroadcastModule {}
