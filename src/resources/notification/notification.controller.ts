import { Controller, Get, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Notifications } from './notification.entity';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/middleware/get-user.decorator';
import { User } from '../auth/user.entity';
import { UserEventPayload } from 'src/dto/events';
import {
  AllNotificationPayload,
  NotificationData,
} from 'src/dto/notification/notifications.dto';

@Controller('notifications')
@ApiTags('Notifications')
export class NotificationsController {
  constructor(private notificationService: NotificationService) {}
  @Get('')
  @ApiOkResponse({ description: 'Successful', type: NotificationData })
  @UseGuards(AuthGuard())
  getUserNotification(@GetUser() user: User): Promise<Notifications[]> {
    return this.notificationService.getNormalizedNotification(user.id);
  }

  @Get('/date-format')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'Successful', type: AllNotificationPayload })
  getUserNotificationDateCategory(
    @GetUser() user: User,
  ): Promise<Notifications[]> {
    return this.notificationService.getUserNotificationDateCategory(user.id);
  }
}
