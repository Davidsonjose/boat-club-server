import { Module, forwardRef } from '@nestjs/common';
import { OtpService } from './otp.service';
import TwilioService from 'src/services/twilio/twilio.service';
import { ActivityModule } from '../activity/activity.module';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { ActivityService } from '../activity/activity.service';
import { TwilioModule } from 'src/services/twilio/twilio.module';
import { ConfigModule } from '@nestjs/config';
import { OtpController } from './otp.controller';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => ActivityModule),
    forwardRef(() => TwilioModule),
    forwardRef(() => UserModule),
  ],
  providers: [OtpService],
  controllers: [OtpController],
  exports: [OtpService],
})
export class OtpModule {}
