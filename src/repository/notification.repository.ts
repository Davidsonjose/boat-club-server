import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserLocationDto } from 'src/dto/auth/user.dto';
import { CreateNotificationDto } from 'src/dto/notification/notifications.dto';
import { Location } from 'src/resources/location/location.entity';
import { Notifications } from 'src/resources/notification/notification.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectRepository(Notifications)
    private readonly notificationRepository: Repository<Notifications>,
  ) {}

  async createNotification(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notifications> {
    const { category, href, message, rel } = createNotificationDto;

    const newNotification: Notifications = this.notificationRepository.create({
      category,
      rel,
      message,
      href,
    });

    await newNotification.save();
    return newNotification;
  }

  async getUserNotification(userId: string): Promise<Notifications[]> {
    return await this.notificationRepository.find({ where: { userId } });
  }
}
