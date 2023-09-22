import { Injectable, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthRepository } from 'src/repository/auth.repository';
import { LocationModule } from '../location/location.module';
import { SettingsModule } from '../settings/settings.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { RefreshToken } from './refreshToken.entity';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './jwt.strategy';
import { UserRepository } from 'src/repository/user.repository';
import { CompanyModule } from '../company/company.module';
import { ActivityModule } from '../activity/activity.module';
import { OtpModule } from '../otp/otp.module';
import { NotificationModule } from '../notification/notification.module';
import { NotificationRepository } from 'src/repository/notification.repository';
import { Notifications } from '../notification/notification.entity';
import { Settings } from '../settings/settings.entity';
import { RabbitMQModule } from 'src/services/rabbitMQ/rabbitmq.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'jwt-secret',
    }),
    TypeOrmModule.forFeature([User, RefreshToken, Notifications, Settings]),
    LocationModule,
    SettingsModule,
    CompanyModule,
    ActivityModule,
    OtpModule,
    SettingsModule,
    RabbitMQModule,
    // NotificationModule,
    // UserModule,
  ],
  providers: [
    AuthService,
    AuthRepository,
    UserService,
    JwtStrategy,
    UserRepository,
    NotificationRepository,
  ],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule, AuthService],
})
export class AuthModule {}
