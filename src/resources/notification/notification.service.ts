import { Injectable } from '@nestjs/common';
import { NotificationRepository } from 'src/repository/notification.repository';
import { Notifications } from './notification.entity';

@Injectable()
export class NotificationService {
  constructor(private notificationRepository: NotificationRepository) {}

  async getUserNotification(userId: string): Promise<Notifications[]> {
    return await this.notificationRepository.getUserNotification(userId);
  }
}
