// otp/otp.service.ts
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OtpVerification } from './otpVerification';
import { NodemailerService } from 'src/helpers/nodemailer.service';
import { Repository } from 'typeorm';
import {
  CreateOtpDto,
  OtpChannelType,
  OtpEmailTypeEnum,
  VerifyOtpDto,
} from 'src/dto/otp';
import { ActivityService } from '../activity/activity.service';
import * as path from 'path';
import * as ejs from 'ejs';
import { User } from '../auth/user.entity';
import { ActivityEnumType } from 'src/dto/activity/activity.dto';

@Injectable()
export class OtpService {
  constructor(
    private readonly nodemailerService: NodemailerService,
    @InjectRepository(OtpVerification)
    private otpVerificationRepository: Repository<OtpVerification>,
    private activityService: ActivityService,
  ) {}

  async generateAndSendOtp(createOtpDto: CreateOtpDto): Promise<any> {
    console.log('ongoing');
    const { channel, email, user } = createOtpDto;
    const singleActivity = await this.activityService.getSingleActivity(
      createOtpDto.activityHash,
      user.id,
    );
    if (channel == OtpChannelType.EMAIL) {
      await this.sendOtpEmail(user, singleActivity.activityType);
      return { message: 'Email sent successfully' };
    }
  }

  async sendOtpEmail(user: User, emailType: ActivityEnumType) {
    const otp = this.generateRandomOtp();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP expiration time

    await this.otpVerificationRepository.save({
      userId: user.id,
      otp,
      expiresAt,
      channel: OtpChannelType.EMAIL,
    });

    await this.sendMailTemplate(emailType, user, otp);
  }

  async sendMailTemplate(
    emailType: ActivityEnumType,
    user: User,
    otp: string,
  ): Promise<void> {
    // console.log(emailType, user);
    if (emailType == ActivityEnumType.SIGNUP) {
      const signUpTemplate = path.resolve(
        __dirname,
        '../../template/otp',
        'sign-up.html',
      );

      const template = await ejs.renderFile(signUpTemplate, {
        otpCode: otp,
        company: user.company,
        user,
      });

      await this.nodemailerService.sendMail(user.email, template, otp);
    } else if (emailType == ActivityEnumType.SIGNIN) {
      const signInTemplate = path.resolve(
        __dirname,
        '../../template/otp',
        'verify-auth.html',
      );
      const verifyotp = await ejs.renderFile(signInTemplate, {
        otpCode: otp,
        company: user.company,
        user,
      });
      await this.nodemailerService.sendMail(user.email, verifyotp, otp);
    } else if (emailType == ActivityEnumType.FORGOT_PASSWORD) {
      const resetPasswordTemplate = path.resolve(
        __dirname,
        '../../template/otp',
        'forgot-password.html',
      );

      const template = await ejs.renderFile(resetPasswordTemplate, {
        otpCode: otp,
        company: user.company,
        user,
      });
      await this.nodemailerService.sendMail(user.email, template, otp);
    }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<boolean> {
    const { userId, otp, activityHash } = verifyOtpDto;
    const record = await this.otpVerificationRepository.findOne({
      where: { userId, otp },
    });

    //

    if (!record) {
      throw new BadRequestException(
        'Invalid OTP or Expired otp. Please check your inbox and try again.',
      );
    }

    // Check if OTP is still valid (not expired)
    const now = new Date();
    if (record.expiresAt < now) {
      throw new BadRequestException(
        'Invalid OTP or Expired otp. Please check your inbox and try again.',
      );
    }

    if (activityHash) {
      const activityRecord = await this.activityService.getSingleActivity(
        activityHash,
        userId,
      );

      const activityDto = {
        userId,
        activityType: activityRecord.activityType,
        activityHash,
      };
      await this.activityService.updateActivityStatus(activityDto);
    }

    // Delete the verified OTP record from the database
    await this.otpVerificationRepository.delete({ userId });

    return true;
  }

  private generateRandomOtp(length: number = 6): string {
    const characters = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += characters[Math.floor(Math.random() * characters.length)];
    }
    return otp;
  }
}
