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
import { CreateOtpDto, OtpChannelType, VerifyOtpDto } from 'src/dto/otp';
import { ActivityService } from '../activity/activity.service';
import * as path from 'path';
import * as ejs from 'ejs';

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
    const { channel, email, userId } = createOtpDto;

    if (channel == OtpChannelType.EMAIL) {
      await this.sendOtpEmail(email, userId);
      return { message: 'Email sent successfully' };
    }
  }

  async sendOtpEmail(email: string, userId: string) {
    const otp = this.generateRandomOtp();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP expiration time

    const templatePath = path.resolve(
      __dirname,
      '../../template/otp',
      'sign-up.html',
    );

    const template = await ejs.renderFile(templatePath, { otpCode: otp });
    console.log(template, 'rendered template');
    await this.otpVerificationRepository.save({
      userId,
      otp,
      expiresAt,
      channel: OtpChannelType.EMAIL,
    });
    await this.nodemailerService.sendMail(email, template, otp);
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
