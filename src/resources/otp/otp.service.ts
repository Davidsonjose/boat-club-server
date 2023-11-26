import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';

import { Location, User } from '@prisma/client';
import TwilioService from 'src/services/twilio/twilio.service';
import {
  OtpChannelType,
  VerifyEmailOtpDto,
  VerifyOtpDto,
  VerifySmsOtpDto,
} from 'src/dto/otp';
import { ActivityUsageEnum, GetUserDto } from 'src/dto/auth/user.dto';
import { ActivityService } from '../activity/activity.service';
import { UserService } from '../user/user.service';

@Injectable()
export class OtpService {
  constructor(
    private twilioService: TwilioService,
    private activityService: ActivityService,

    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  async sendUserEmailOtp(user: User | GetUserDto) {
    if (!user.email) {
      throw new Error(
        'Your email is not added yet. Please add it in your profile',
      );
    }
    const resp = await this.twilioService.sendOtp({
      channel: 'EMAIL',
      email: user.email,
    });

    return resp;
  }

  async sendUserSmsOtp(user: User & { Location: Location }) {
    if (!user.phoneNumber) {
      throw new Error(
        'Your phone number is not added yet. Please add it in your profile',
      );
    }
    const phoneNumberObj = await this.twilioService.validatePhoneNumber({
      countryCode: user.Location.dialCode,
      phoneNumber: user.phoneNumber,
    });
    const resp = await this.twilioService.sendOtp({
      channel: OtpChannelType.SMS,
      fullyFormedPhoneNumber: phoneNumberObj.phoneNumber,
    });

    return resp;
  }

  async verifyEmailOtp(data: VerifyEmailOtpDto, user?: GetUserDto) {
    const verifyResponse = await this.twilioService.verifyOtp({
      code: data.otp,
      email: data.email,
    });

    if (data.activityHash && user) {
      const { activityHash } = data;
      const singleActivity = await this.activityService.verifyUserActivity(
        activityHash,
        user,
        ActivityUsageEnum.TWO_AUTHENTICATION,
      );
      await this.activityService.updateActivityStatus({
        activityHash,
        userId: user.id,
        activityType: singleActivity.activityType,
      });
    }

    if (data.verifyEmail == true) {
      return await this.userService.emailVerified(data.email);
    }

    return verifyResponse;
  }

  async verifySmsOtp(data: VerifySmsOtpDto) {
    const verifyResponse = await this.twilioService.verifyOtp({
      code: data.otp,
      countryCode: data.dialCode,
      phoneNumber: data.phoneNumber,
    });

    return verifyResponse;
  }
}
