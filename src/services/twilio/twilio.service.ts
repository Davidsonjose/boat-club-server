import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isEmpty } from 'lodash';
import systemConfig, { SystemConfigDto } from 'src/config/systemConfig';
import { Twilio } from 'twilio';

@Injectable()
export default class TwilioService {
  private twilio: Twilio;
  private serviceSid: string;
  constructor(
    private configService: ConfigService, // private data: { //   accountSid: string; //   authToken: string; //   serviceSid: string; // },
  ) {
    this.twilio = new Twilio(
      'AC6c0bda61baf350525cc33664ac4f2dd8',
      '4657d2cfe760506e9c50e9a0070b815a',
    );
    this.serviceSid = 'VAd48e257f0fc9b60d5647cd6d45a45262';
  }

  async sendOtp(data: {
    phoneNumber?: string;
    countryCode?: string;
    email?: string;
    fullyFormedPhoneNumber?: string;
    channel: 'SMS' | 'EMAIL';
  }) {
    const phoneNumber = !isEmpty(data.fullyFormedPhoneNumber)
      ? data.fullyFormedPhoneNumber
      : `${data.countryCode}${data.phoneNumber}`;
    const subject = data.channel === 'SMS' ? phoneNumber : data.email;
    if (!subject) {
      throw new Error(
        `undefined destination recieved for channel: ${data.channel}. Cannot send OTP`,
      );
    }

    try {
      const resp = await this.twilio.verify.v2
        .services(this.serviceSid)
        .verifications.create({
          to: subject,
          channel: data.channel.toLowerCase(),
        });
      Logger.log(
        `Sent OTP successfully. Twilio returned status: ${resp.status}`,
      );

      return resp;

      // if (resp.status !== 'approved') {
      //     AppModule.loggingService.error(`Failed to send OTP. Twilio returned status: ${resp.status}`);
      // }
    } catch (err: any) {
      Logger.error(err);
      throw new Error(
        `Failed to send OTP to ${subject} on channel ${data.channel}. ${err.message}`,
      );
    }
  }

  async verifyOtp(data: {
    phoneNumber?: string;
    email?: string;
    countryCode?: string;
    fullyFormedPhoneNumber?: string;
    code: string;
  }) {
    const phoneNumber = !isEmpty(data.fullyFormedPhoneNumber)
      ? data.fullyFormedPhoneNumber
      : `${data.countryCode}${data.phoneNumber}`;
    const subject = data.email ? data.email : data.phoneNumber; // if no email, then phone number must be correct. If undefined phne number, throw error

    try {
      const resp = await this.twilio.verify.v2
        .services(this.serviceSid)
        .verificationChecks.create({ to: subject, code: data.code });

      if (resp.status !== 'approved') {
        Logger.error(`OTP not valid`);
        throw new Error(`OTP code ${data.code} supplied not valid`);
      }
      return resp;
    } catch (err: any) {
      Logger.error(err);
      const lowerMsg = err.message?.toLowerCase();
      const message =
        lowerMsg.includes('was not found') &&
        lowerMsg.includes('the requested resource /services')
          ? 'The OTP token has expired. Please resend OTP'
          : `Failed to verify OTP for ${subject}. ${err.message}`;
      throw new Error(message);
    }
  }

  async validatePhoneNumber(data: {
    phoneNumber?: string;
    countryCode?: string;
    fullyFormedPhoneNumber?: string;
  }) {
    const phoneNumber = !isEmpty(data.fullyFormedPhoneNumber)
      ? data.fullyFormedPhoneNumber
      : `${data.countryCode}${data.phoneNumber}`;
    try {
      const resp = await this.twilio.lookups.v1
        .phoneNumbers(phoneNumber!)
        .fetch();
      return resp;
    } catch (err: any) {
      Logger.error(err);
      throw new Error(
        `${phoneNumber} validation failed. Please ensure you enter a valid phone number`,
      );
    }
  }

  async sendPlainWithText(email: string) {
    // await this.twilio.messages.create({
    //   body: `Your OTP for Shonibare App is: 543210`,
    //   to: '+2349040297300',
    // });
    const resp = await this.twilio.verify.v2
      .services(this.serviceSid)
      .verifications.create({
        to: '+2349040297300',
        channel: 'sms',
      });
  }
}
