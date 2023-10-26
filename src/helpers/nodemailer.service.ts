// otp/nodemailer.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NodemailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com', // Brevo SMTP server
      port: 587, // Port 587 for TLS
      secure: false,
      auth: {
        user: 'testbalosh@gmail.com', // Your email address
        pass: 'DnCYMrjaSBU7z9pd', // Your master password
      },
    });
  }

  async sendMail(email: string, template: string, otp?: string): Promise<void> {
    try {
      // const mailOptions = {
      //   from: 'quixcelsolution@gmail.com', // Your email address
      //   to: email,
      //   subject: 'OTP Verification',
      //   html: template,
      // };
      // await this.transporter.sendMail(mailOptions);

      await axios({
        method: 'post',
        url: 'https://api.brevo.com/v3/smtp/email',
        headers: {
          'Content-Type': 'application/json',
          'api-key':
            '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',
        },
        data: {
          sender: {
            name: 'Chevyview Estate',
            email: 'info@lfzaccess.com',
          },
          to: [{ email: email }],
          subject: 'Otp Verification',
          template,
        },
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw new BadRequestException('Could not send email');
    }
  }
}
