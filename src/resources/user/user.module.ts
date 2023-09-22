import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { UserRepository } from 'src/repository/user.repository';
import { LocationModule } from '../location/location.module';
import { SettingsModule } from '../settings/settings.module';
import { PassportModule } from '@nestjs/passport';
import { ActivityModule } from '../activity/activity.module';
import { OtpModule } from '../otp/otp.module';
import { NotificationRepository } from 'src/repository/notification.repository';
import { Notifications } from '../notification/notification.entity';
import { NotificationService } from '../notification/notification.service';
import { Settings } from '../settings/settings.entity';
import { RabbitMQModule } from 'src/services/rabbitMQ/rabbitmq.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Notifications, Settings]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    LocationModule,
    SettingsModule,
    ActivityModule,
    OtpModule,
    SettingsModule,
    RabbitMQModule,
  ],
  providers: [UserService, UserRepository, NotificationRepository],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
