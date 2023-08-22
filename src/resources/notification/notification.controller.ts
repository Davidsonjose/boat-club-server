import { Controller, Get } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Notifications } from './notification.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('notifications')
@ApiTags('Notifications')
export class NotificationsController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  getUserNotification(userId: string): Promise<Notifications[]> {
    return this.notificationService.getUserNotification(userId);
  }
}
