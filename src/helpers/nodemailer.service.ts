import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { CompantDetailsDto } from './mailService';

export enum CompanyId {
  CHEVY = 1,
  KIGRA = 2,
  LEKKI_COUNTY = 3,
  PINNOCK = 4,
  ORAL = 5,
  SHONIBARE = 6,
}

@Injectable()
export class NodemailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // this.transporter = nodemailer.createTransport({
    //   host: 'lfzaccess.com', // Default SMTP host
    //   port: 465, // Default port
    //   secure: true, // Default secure setting
    //   auth: {
    //     user: 'info@lfzaccess.com', // Default user
    //     pass: '0fw=[mW$RRP6', // Default password
    //   },
    // });
  }

  private getCompanyDetails(companyId: CompanyId): CompantDetailsDto {
    let companyDetails = {
      host: 'lfzaccess.com',
      user: 'info@lfzaccess.com',
      pass: '0fw=[mW$RRP6',
    };

    // Update companyDetails based on companyId
    switch (companyId) {
      case CompanyId.CHEVY:
        companyDetails = {
          host: 'balosh.com',
          user: 'chevyview@balosh.com',
          pass: 'chevyview12345$',
        };
        break;
      case CompanyId.KIGRA:
        companyDetails = {
          host: 'balosh.com',
          user: 'kigra@balosh.com',
          pass: 'kigra12345$',
        };
        break;
      case CompanyId.LEKKI_COUNTY:
        companyDetails = {
          host: 'balosh.com',
          user: 'lekkycounty@balosh.com',
          pass: 'lekkycounty12345$',
        };
        break;
      case CompanyId.ORAL:
        companyDetails = {
          host: 'balosh.com',
          user: 'oralestate@balosh.com',
          pass: 'oralestate12345$',
        };
        break;
      case CompanyId.PINNOCK:
        companyDetails = {
          host: 'balosh.com',
          user: 'pinnockbeach@balosh.com',
          pass: 'pinnockbeach12345$',
        };
        break;

      case CompanyId.SHONIBARE:
        companyDetails = {
          host: 'balosh.com',
          user: 'shonibare@balosh.com',
          pass: 'shonibare12345$',
        };
        break;
      default:
        // Handle cases for other companies
        companyDetails = {
          host: 'lfzaccess.com',
          user: 'info@lfzaccess.com',
          pass: '0fw=[mW$RRP6',
        };
        break;
    }

    return companyDetails;
  }

  async sendMail(
    companyId: number,
    email: string,
    template: string,
    otp?: string,
  ): Promise<void> {
    try {
      const companyDetails = this.getCompanyDetails(companyId);

      const mailOptions = {
        from: companyDetails.user,
        to: email,
        subject: 'OTP Verification',
        html: template,
      };

      // Use the specific company's SMTP details
      const companyTransporter = nodemailer.createTransport({
        host: companyDetails.host,
        port: 465, // Use port 587 for TLS
        secure: true, // Use TLS (false for port 587)
        auth: {
          user: companyDetails.user,
          pass: companyDetails.pass,
        },
      });

      await companyTransporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Could not send email');
    }
  }
}
