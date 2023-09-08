import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notifications } from './notification.entity';
import { NotificationRepository } from 'src/repository/notification.repository';
import { NotificationsController } from './notification.controller';
import { User } from '../auth/user.entity';
import { UserRepository } from 'src/repository/user.repository';
import { AuthRepository } from 'src/repository/auth.repository';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { ActivityService } from '../activity/activity.service';
import { OtpService } from '../otp/otp.service';
import { LocationService } from '../location/location.service';
import { ActivityModule } from '../activity/activity.module';
import { OtpModule } from '../otp/otp.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'jwt-secret',
    }),
    TypeOrmModule.forFeature([Notifications, User]),
    ActivityModule,
    OtpModule,
  ],
  providers: [
    NotificationService,
    NotificationRepository,
    UserRepository,
    UserService,
  ],
  controllers: [NotificationsController],
  exports: [NotificationService],
})
export class NotificationModule {}
