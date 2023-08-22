// otp/nodemailer.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NodemailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'lfzaccess.com', // Replace with your SMTP host
      port: 465, // Use port 587 for TLS
      secure: true, // Use TLS (false for port 587)
      auth: {
        user: 'info@lfzaccess.com', // Gmail or cPanel email
        pass: '0fw=[mW$RRP6', // Gmail or cPanel password
      },
    });
    // this.transporter = nodemailer.createTransport({
    //   host: 'smtp.lfzaccess.com', // Replace with your SMTP host
    //   port: 587, // Use port 587 for TLS
    //   secure: false, // Use TLS (false for port 587)
    //   auth: {
    //     user: 'info@lfzaccess.com', // Gmail or cPanel email
    //     pass: '0fw=[mW$RRP6', // Gmail or cPanel password
    //   },
    // });
  }

  async sendMail(email: string, otp?: string): Promise<void> {
    try {
      const mailOptions = {
        from: 'info@lfzaccess.com', // Change this to your email
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP: ${otp}`,
      };
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Could not send email');
    }
  }
}
