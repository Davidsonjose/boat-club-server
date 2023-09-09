import { Injectable } from '@nestjs/common';
import { NotificationRepository } from 'src/repository/notification.repository';
import { Notifications } from './notification.entity';
import { CreateNotificationPropsData } from 'src/dto/notification/notifications.dto';

@Injectable()
export class NotificationService {
  constructor(private notificationRepository: NotificationRepository) {}

  async getUserNotificationDateCategory(
    userId: string,
  ): Promise<Notifications[]> {
    return await this.notificationRepository.getUserNotification(userId);
  }

  async createNewNotification(
    createNotificationPropsData: CreateNotificationPropsData,
  ) {
    await this.notificationRepository.createNotification(
      createNotificationPropsData,
    );
  }

  async getNormalizedNotification(userId: string): Promise<Notifications[]> {
    return await this.notificationRepository.userNotifications(userId);
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    return await this.notificationRepository.markAllNotificationsAsRead(userId);
  }

  async markSingleNotificationAsRead(userId: number): Promise<void> {
    return await this.notificationRepository.markSingleNotificationAsRead(
      userId,
    );
  }
}
