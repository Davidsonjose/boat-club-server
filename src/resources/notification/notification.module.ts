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
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { Settings } from '../settings/settings.entity';
import { SettingsModule } from '../settings/settings.module';
import { RabbitMQModule } from 'src/services/rabbitMQ/rabbitmq.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'jwt-secret',
    }),
    TypeOrmModule.forFeature([Notifications, User, Settings]),
    ActivityModule,
    OtpModule,
    UserModule,
    AuthModule,
    RabbitMQModule,
    // SettingsModule,
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
