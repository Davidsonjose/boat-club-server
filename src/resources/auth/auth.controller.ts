import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthRefreshAccessTokenDto } from 'src/dto/auth/auth-token.dto';
import {
  CreateUserDto,
  ForgotPasswordUpdateDto,
  ForgotPasswordVerificationDto,
  ForgotVerifyPayload,
  SignInUserDto,
} from 'src/dto/auth/user.dto';
import {
  ForgotPasswordVerifyPayload,
  OtpChannelType,
  VerifyForgotOtpDto,
  VerifyOtpDto,
  VerifySmsOtpDto,
} from 'src/dto/otp';
import { HttpGuard } from 'src/guards/http.guard';
import { enrichWithErrorDetail } from 'src/helpers/axiosError';
import {
  responseError,
  responseOk,
  safeResponse,
} from 'src/helpers/http-response';
import { systemResponses } from 'src/res/systemResponse';
import { UserService } from '../user/user.service';
import { OtpService } from '../otp/otp.service';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private userService: UserService,

    private otpService: OtpService,

    private authService: AuthService,
  ) {}

  @Post('/signUp')
  @UseGuards(HttpGuard)
  async create(
    @Req() fastifyRequest: any,
    @Body() createUserDto: CreateUserDto,
  ) {
    try {
      const resp = await this.userService.create({
        ...createUserDto,
        ipAddress: fastifyRequest.requestState.clientIp,
      });

      if (!resp) {
        throw new HttpException(
          `Failed to create User account`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return resp;
      //   return responseOk({
      //     data: resp,
      //     message: `Created new user account`,
      //   });
    } catch (err: any) {
      const errMsg = safeResponse(err);
      console.log(err);

      Logger.error(err);

      throw responseError({
        cause: err,
        message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
      });
    }
  }

  @Post('/login')
  @UseGuards(HttpGuard)
  async userLogin(
    @Req() fastifyRequest: any,
    @Body() createAuthDto: SignInUserDto,
  ) {
    try {
      const createResp = await this.authService.login({
        email: createAuthDto.email,
        ipAddress: fastifyRequest.requestState.clientIp,
        pwd: createAuthDto.pwd,
      });

      return {
        user: createResp.user,
        accessToken: createResp.accessToken,
        refreshToken: createResp.refreshToken,
        activityHash: createResp.activityHash,
      };
    } catch (err: any) {
      console.log(err);
      const errMsg = safeResponse(err);

      throw responseError({
        cause: err,
        message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
      });
    }
  }

  @Post('/refreshAccessToken')
  @UseGuards(HttpGuard)
  async refreshAccessToken(
    @Req() fastifyRequest: any,
    @Body() refreshTokenDto: AuthRefreshAccessTokenDto,
  ) {
    try {
      const resp = await this.authService.getNewAccessToken({
        ipAddress: fastifyRequest.requestState.clientIp,
        refreshToken: refreshTokenDto.refreshToken,
      });

      //   return responseOk({
      //     data: resp,
      //     message: `Gotten new accessToken`,
      //   });
      return resp;
    } catch (err: any) {
      const errMsg = safeResponse(err);
      Logger.error(err);
      throw responseError({
        cause: err,
        message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
      });
    }
  }

  @Post('/forgot_password_verify')
  @ApiOkResponse({
    description: 'Successful',
    type: ForgotPasswordVerifyPayload,
  })
  async forgetPasswordVerify(
    @Body()
    forgotPasswordVerificationDto: ForgotPasswordVerificationDto,
  ): Promise<ForgotVerifyPayload> {
    try {
      return await this.userService.forgotPasswordVerify(
        forgotPasswordVerificationDto,
      );
    } catch (err) {
      const errMsg = safeResponse(enrichWithErrorDetail(err).error);
      throw responseError({
        cause: err,
        message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
      });
    }
  }

  @Put('/forgot_password_update')
  @ApiOkResponse({ description: 'Successful' })
  async forgetPasswordUpdate(
    @Body()
    forgotPasswordUpdateDto: ForgotPasswordUpdateDto,
  ) {
    try {
      await this.userService.forgotPasswordUpdate(forgotPasswordUpdateDto);
    } catch (err) {
      const errMsg = safeResponse(enrichWithErrorDetail(err).error);
      throw responseError({
        cause: err,
        message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
      });
    }
  }

  @Post('/forgot_verify_otp')
  @ApiOkResponse({
    description: 'Successful',
  })
  async verifyForgotOtp(
    @Body()
    verifyForgotOtp: VerifyForgotOtpDto,
  ) {
    try {
      if (verifyForgotOtp.channel == OtpChannelType.EMAIL) {
        const info: VerifyOtpDto = {
          otp: verifyForgotOtp.otp,
          email: verifyForgotOtp.email,
          channel: verifyForgotOtp.channel,
        };
        return await this.otpService.verifyEmailOtp(info);
      } else if (verifyForgotOtp.channel == OtpChannelType.SMS) {
        const info: VerifySmsOtpDto = {
          otp: verifyForgotOtp.otp,
          phoneNumber: verifyForgotOtp.phone,
          dialCode: verifyForgotOtp.diaCode,
        };
        return await this.otpService.verifySmsOtp(info);
      }
    } catch (err) {
      const errMsg = safeResponse(enrichWithErrorDetail(err).error);
      throw responseError({
        cause: err,
        message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
      });
    }
  }
}
