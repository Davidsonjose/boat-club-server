import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OtpService } from './otp.service';
import { HttpGuard } from 'src/guards/http.guard';
import { AuthGuard } from 'src/guards/auth.guard';

import { ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/middleware/get-user.decorator';
import { GetUserDto } from 'src/dto/auth/user.dto';
import {
  responseError,
  responseOk,
  safeResponse,
} from 'src/helpers/http-response';
import { systemResponses } from 'src/res/systemResponse';
import { CreateOtpDto, VerifyEmailOtpDto, VerifySmsOtpDto } from 'src/dto/otp';

@Controller('otp')
@ApiTags('otp')
export class OtpController {
  @Inject()
  private readonly otpService: OtpService;

  constructor() {}

  @UseGuards(HttpGuard, AuthGuard)
  @Post('send-email-otp')
  async sendEmailOtp(@Body() data: CreateOtpDto, @GetUser() user: GetUserDto) {
    try {
      // const resp = await this.otpService.sendOtp({
      //   isDeveloper: fastifyRequest.requestState.isDeveloper,
      //   personId: fastifyRequest.requestState.id,
      //   type: data.type,
      // });
      await this.otpService.sendUserEmailOtp(user);
      return responseOk({
        data: true,
        message: ` OTP sent!`,
        status: HttpStatus.OK,
      });
    } catch (err: any) {
      const errMsg = safeResponse(err);
      Logger.error(err);
      throw responseError({
        cause: err,
        message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
      });
    }
  }

  @Post('send-sms-otp')
  @UseGuards(HttpGuard, AuthGuard)
  async sendSmsOtp(@Body() data: CreateOtpDto) {
    try {
      // const resp = await this.otpService.sendOtp({
      //   isDeveloper: fastifyRequest.requestState.isDeveloper,
      //   personId: fastifyRequest.requestState.id,
      //   type: data.type,
      // });
      return responseOk({
        data: true,
        message: ` OTP sent!`,
        status: HttpStatus.OK,
      });
    } catch (err: any) {
      const errMsg = safeResponse(err);
      Logger.error(err);
      throw responseError({
        cause: err,
        message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
      });
    }
  }

  @UseGuards(HttpGuard, AuthGuard)
  @Post('verify-email-otp')
  async verifyEmailOtp(
    @Body() data: VerifyEmailOtpDto,
    @GetUser() user: GetUserDto,
  ) {
    try {
      const resp = await this.otpService.verifyEmailOtp(
        {
          otp: data.otp,
          email: data.email,
          verifyEmail: data.verifyEmail,
        },
        user,
      );

      if (!resp) {
        throw new Error('OTP code is either expired or invlaid');
      }

      return responseOk({
        data: true,
        message: `OTP validated successfully`,
        status: HttpStatus.OK,
      });
    } catch (err: any) {
      const errMsg = safeResponse(err);
      Logger.error(err);
      throw responseError({
        cause: err,
        message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
      });
    }
  }

  @UseGuards(HttpGuard, AuthGuard)
  @Post('verify-sms-otp')
  async verifySmsOtp(@Body() data: VerifySmsOtpDto) {
    try {
      const resp = await this.otpService.verifySmsOtp({
        otp: data.otp,
        phoneNumber: data.phoneNumber,
        dialCode: data.dialCode,
      });

      if (!resp) {
        throw new Error('OTP code is either expired or invlaid');
      }

      return responseOk({
        data: true,
        message: `OTP validated successfully`,
        status: HttpStatus.OK,
      });
    } catch (err: any) {
      const errMsg = safeResponse(err);
      Logger.error(err);
      throw responseError({
        cause: err,
        message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
      });
    }
  }
}
