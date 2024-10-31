// twilio.service.ts

import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class TwilioService {
  private twilioClient: Twilio;

  constructor() {
    this.twilioClient = new Twilio('', '');
  }

  async sendWhatsAppMessage(
    // to: string,
    // body: string,
    mediaUrl?: string,
  ): Promise<any> {
    const info = await this.twilioClient.messages.create({
      from: 'whatsapp:+14155238886',
      to: `whatsapp:+2349052987399`,
      body: 'Hello Davidson, here is your invite to the wedding',
      //   mediaUrl: [
      //     'https://drive.google.com/file/d/1yDhaU-Ak0iNcAFHOnLLd-LJPGtF1Vppk/view?usp=drive_link',
      //   ],
      mediaUrl: [
        'https://res.cloudinary.com/dhblwdgrp/image/upload/v1699899148/Abdul_Abdulrahim_e2hst8.pdf',
      ],
    });
    console.log(info);
    return info;
  }
}
