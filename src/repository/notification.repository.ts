import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserLocationDto } from 'src/dto/auth/user.dto';
import { CreateNotificationPropsData } from 'src/dto/notification/notifications.dto';
import { User } from 'src/resources/auth/user.entity';
import { Location } from 'src/resources/location/location.entity';
import { Notifications } from 'src/resources/notification/notification.entity';
import { Repository } from 'typeorm';
import { UserRepository } from './user.repository';
import { UserService } from 'src/resources/user/user.service';

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectRepository(Notifications)
    private readonly notificationRepository: Repository<Notifications>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createNotification(
    createNotificationPropsData: CreateNotificationPropsData,
  ): Promise<Notifications> {
    const { category, href, message, type, user } = createNotificationPropsData;

    const newNotification: Notifications = this.notificationRepository.create({
      category,
      type,
      message,
      href,
      userId: user.id,
      user,
    });

    await newNotification.save();
    await this.updateNotificationUserData(user);
    return newNotification;
  }

  async updateNotificationUserData(user: User) {
    user.settings.unseenNotification = user.settings.unseenNotification + 1;
    user.settings.notificationSeen = false;
    await this.userRepository.save(user);
  }

  async userNotifications(userId: string): Promise<Notifications[]> {
    return await this.notificationRepository.find({ where: { userId } });
  }

  async getUserNotification(userId: string): Promise<any[]> {
    const userNotifications = await this.userNotifications(userId);
    const transformedNotifications = [];

    // Group notifications by date
    const groupedNotifications = userNotifications.reduce(
      (groups, notification) => {
        const dateKey = notification.createdAt.toISOString().split('T')[0];

        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }

        groups[dateKey].push({
          title: notification.category, // You can adjust this based on your data
          message: notification.message,
          category: notification.category,
          date: notification.createdAt.toISOString(), // You can format this date
          id: notification.id.toString(), // Convert to string if needed
          read: notification.read,
        });

        return groups;
      },
      {},
    );

    // Create the desired structure
    for (const dateKey of Object.keys(groupedNotifications)) {
      transformedNotifications.push({
        notificationDate: dateKey,
        notifications: groupedNotifications[dateKey],
      });
    }

    return transformedNotifications;
  }

  // async getSingleNotification(notificationId: string): Promise<Notifications> {
  //   return await this.notificationRepository.findOne({where: {id: }})
  // }

  async markAllNotificationsAsRead(user: User): Promise<void> {
    await this.notificationRepository.update(
      { userId: user.id, read: false },
      { read: true },
    );

    await this.updateNotificationUserData(user);
  }

  async markSingleNotificationAsRead(notificationId: number): Promise<void> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.read = true;
    await this.notificationRepository.save(notification);
  }
}
