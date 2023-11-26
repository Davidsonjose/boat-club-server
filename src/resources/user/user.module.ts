import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ActivityModule } from '../activity/activity.module';
import { DatabaseService } from 'src/services/database/database.service';
import IpwhoisService from 'src/services/ipwhois/IpwhoisService';
import { ActivityService } from '../activity/activity.service';
import { OtpModule } from '../otp/otp.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => ActivityModule),
    forwardRef(() => OtpModule),
    forwardRef(() => AuthModule),
  ],
  providers: [UserService, DatabaseService, IpwhoisService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
