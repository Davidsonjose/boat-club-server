import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { ActivityModule } from '../activity/activity.module';
import { ConfigModule } from '@nestjs/config';
import { OtpModule } from '../otp/otp.module';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => UserModule),
    ActivityModule,
    OtpModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
