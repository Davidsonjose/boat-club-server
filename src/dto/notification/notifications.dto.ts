import { User } from '@prisma/client';
import {
  NotificationCategories,
  NotificationRel,
} from './notification-enum.dto';
import { ApiProperty } from '@nestjs/swagger';

export interface CreateNotificationPropsData {
  category: NotificationCategories;
  href?: string;
  message: string;
  type: NotificationRel;
  user: User;
}

export class NotificationData {
  @ApiProperty()
  title: string;

  @ApiProperty()
  message: string;

  @ApiProperty({
    type: 'enum',
    enum: NotificationCategories,
    enumName: 'Notification Categories',
  })
  category: NotificationCategories;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  id: string;
}

// $2b$10$b8iw/U/0OZOrGTZTxvzRl.orJ.szkbApp/flD4vBsmMwr0aQR/yO.

export class AllNotificationPayload {
  @ApiProperty()
  notificationDate: string;

  @ApiProperty()
  notifications: NotificationData[];
}

const allnotifications = [
  {
    notificationDate: '20th July, 2023',
    notifications: [
      {
        title: 'Withdrawal',
        message: 'You have successfully funded your wallet',
        category: NotificationCategories.TRANSACTION,
        date: 'July 20, 2023',
        id: '1',
        read: false,
      },
      {
        title: 'Checked In',
        message: 'Adebisi successfully CHECKED IN',
        date: 'May 20, 2023',
        id: '2',
        category: NotificationCategories.VMS,
        read: true,
      },
      {
        title: 'Top Up',
        message: '@theezemmuo sent you $89,000.00',
        category: NotificationCategories.TRANSACTION,
        id: '3',
        read: true,
        date: 'August 1, 2023',
      },
    ],
  },
  {
    notificationDate: '17th July, 2023',
    notifications: [
      {
        title: 'Payment Due',
        message: 'your estate security payment is due pay now',
        category: NotificationCategories.TRANSACTION,
        id: '4',
        read: false,
        date: 'August 1, 2023',
      },
      {
        title: 'Checked Out',
        message: 'Davidson successfully CHECKED OUT',
        date: 'May 20, 2023',
        id: '5',
        category: NotificationCategories.VMS,
        read: true,
      },
    ],
  },
  {
    notificationDate: '16th July, 2023',
    notifications: [
      {
        title: 'Poll',
        message: 'You have a new poll request. Check now',
        date: 'May 20, 2023',
        id: '2',
        category: NotificationCategories.POLL,
        read: false,
      },
    ],
  },
];
