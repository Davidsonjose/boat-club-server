import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import {
  CreateUserDto,
  ForgotPasswordUpdateDto,
  ForgotPasswordVerificationDto,
  ForgotVerifyPayload,
  SignInPayload,
  SignInUserDto,
  SignUpPaylod,
  UserPayloadData,
} from 'src/dto/auth/user.dto';
import { LocationService } from '../location/location.service';
import { UserService } from '../user/user.service';
import { AllowExpiredJwtAuthGuard } from 'src/middleware/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import {
  RefreshTokenDto,
  RefreshTokenPayload,
} from 'src/dto/auth/auth-token.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { responseError, safeResponse } from 'src/helpers/http-response';
import { enrichWithErrorDetail } from 'src/helpers/axiosError';
import { systemResponses } from 'src/res/systemResponse';
import {
  ForgotPasswordVerifyPayload,
  VerifyForgotOtpDto,
  VerifyOtpDto,
} from 'src/dto/otp';
import { OtpService } from '../otp/otp.service';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private authService: AuthService,
    private locationService: LocationService,
    private userService: UserService,
    private otpService: OtpService,
  ) {}

  @Post('/signUp')
  @ApiOkResponse({ description: 'Successful', type: SignUpPaylod })
  async createUser(@Body() createUserDto: CreateUserDto, @Req() req) {
    const ipAddress = req.headers['x-forwarded-for'] || req.ip;
    try {
      return this.authService.createUser(createUserDto, ipAddress);
    } catch (err) {
      const errMsg = safeResponse(enrichWithErrorDetail(err).error);
      throw responseError({
        cause: err,
        message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
      });
    }
  }

  @Post('/signIn')
  @ApiOkResponse({ description: 'Successful', type: SignInPayload })
  async signIn(@Body() signInUserDto: SignInUserDto) {
    try {
      return await this.authService.signIn(signInUserDto);
    } catch (err) {
      const errMsg = safeResponse(enrichWithErrorDetail(err).error);
      throw responseError({
        cause: err,
        message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
      });
    }
  }

  @Post('/refresh')
  @UseGuards(AllowExpiredJwtAuthGuard)
  @ApiOkResponse({ description: 'Successful', type: RefreshTokenPayload })
  async refreshUserToken(
    @Request() req,
    @Body() refreshTokenDto: RefreshTokenDto,
  ) {
    return await this.authService.refreshUserToken(
      req.user.sub,
      refreshTokenDto,
    );
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

  @Post('/forgot_verify_otp')
  @ApiOkResponse({
    description: 'Successful',
  })
  async verifyForgotOtp(
    @Body()
    verifyForgotOtp: VerifyForgotOtpDto,
  ) {
    try {
      return await this.otpService.verifyOtp({
        userId: verifyForgotOtp.userId,
        ...verifyForgotOtp,
      });
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
}
