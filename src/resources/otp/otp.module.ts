import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { OtpVerification } from './otpVerification';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { NodemailerService } from 'src/helpers/nodemailer.service';
import { ActivityModule } from '../activity/activity.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([OtpVerification]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ActivityModule,
  ],
  providers: [OtpService, NodemailerService],
  controllers: [OtpController],
  exports: [NodemailerService, OtpService],
})
export class OtpModule {}
