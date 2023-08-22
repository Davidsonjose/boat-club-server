import {
  NotificationCategories,
  NotificationRel,
} from './notification-enum.dto';

export class CreateNotificationDto {
  category: NotificationCategories;
  href: string;
  message: string;
  rel: NotificationRel;
}
