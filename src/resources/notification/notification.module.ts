import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notifications } from './notification.entity';
import { NotificationRepository } from 'src/repository/notification.repository';
import { NotificationsController } from './notification.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Notifications])],
  providers: [NotificationService, NotificationRepository],
  controllers: [NotificationsController],
  exports: [NotificationService],
})
export class NotificationModule {}
