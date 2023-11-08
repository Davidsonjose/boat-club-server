import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/middleware/get-user.decorator';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../auth/user.entity';
import {
  UpdateEmailDto,
  UpdatePasswordDto,
  UpdatePhoneDto,
  UpdatePinDto,
  UpdatePinPayload,
  UpdateProfileDto,
  UserPayloadData,
  VerifyPinDto,
} from 'src/dto/auth/user.dto';
import { Settings } from '../settings/settings.entity';
import { responseError, safeResponse } from 'src/helpers/http-response';
import { enrichWithErrorDetail } from 'src/helpers/axiosError';
import { systemResponses } from 'src/res/systemResponse';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'Successful', type: UserPayloadData })
  getSingleUser(@GetUser() user: any) {
    return user;
  }

  @Put('/email_verified')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'Successful', type: UserPayloadData })
  async verifyEmail(@GetUser() user: any) {
    try {
      return await this.userService.verifyEmail(user);
    } catch (err) {
      const errMsg = safeResponse(enrichWithErrorDetail(err).error);
      throw responseError({
        cause: err,
        message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
      });
    }
  }

  @Put('/phone_verified')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'Successful', type: UserPayloadData })
  async verifyPhone(@GetUser() user: any) {
    try {
      return await this.userService.verifyPhone(user);
    } catch (err) {
      const errMsg = safeResponse(enrichWithErrorDetail(err).error);
      throw responseError({
        cause: err,
        message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
      });
    }
  }
  @Get('/settings')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'Successful' })
  async getUserSetting(@GetUser() user: User): Promise<Settings> {
    try {
      return await this.userService.getUserSettings(user);
    } catch (err) {
      const errMsg = safeResponse(enrichWithErrorDetail(err).error);
      throw responseError({
        cause: err,
        message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
      });
    }
  }

  @Put('/pushNotificationToken')
  @UseGuards(AuthGuard())
  async pushNotificationToken(
    @GetUser() user: User,
    @Body() { deviceToken }: { deviceToken: string },
  ) {
    try {
      return await this.userService.pushNotificationToken(deviceToken, user);
    } catch (err) {
      const errMsg = safeResponse(enrichWithErrorDetail(err).error);
      throw responseError({
        cause: err,
        message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
      });
    }
  }

  @Post('/verify_pwd')
  @UseGuards(AuthGuard())
  async verifyPassword(@GetUser() user: User, @Body() password: string) {
    try {
      return await this.userService.pushNotificationToken(password, user);
    } catch (err) {
      const errMsg = safeResponse(enrichWithErrorDetail(err).error);
      throw responseError({
        cause: err,
        message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
      });
    }
  }
  //dave

  @Put('/pin')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'Successful' })
  async updatePin(
    @Body() updatePinDto: UpdatePinPayload,
    @GetUser() user: User,
  ): Promise<void> {
    const responseInfo: UpdatePinDto = {
      pin: updatePinDto.pin,
      user,
      activityHash: updatePinDto.activityHash,
    };

    try {
      return await this.userService.updatePin(responseInfo);
    } catch (err) {
      const errMsg = safeResponse(enrichWithErrorDetail(err).error);
      throw responseError({
        cause: err,
        message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
      });
    }
  }

  @Put('/pin/verify')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'Successful' })
  async verifyPin(
    @Body() verifyPinDto: VerifyPinDto,
    @GetUser() user: User,
  ): Promise<void> {
    try {
      return await this.userService.verifyPin(verifyPinDto, user);
    } catch (err) {
      const errMsg = safeResponse(enrichWithErrorDetail(err).error);
      throw responseError({
        cause: err,
        message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
      });
    }
  }

  @Put('/change_password')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'Successful' })
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @GetUser() user: User,
  ): Promise<void> {
    try {
      return this.userService.updatePassword(updatePasswordDto, user);
    } catch (err) {
      const errMsg = safeResponse(enrichWithErrorDetail(err).error);
      throw responseError({
        cause: err,
        message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
      });
    }
  }

  @Put('')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'Successful' })
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @GetUser() user,
  ): Promise<void> {
    try {
      return this.userService.updateProfile(updateProfileDto, user);
    } catch (err) {
      const errMsg = safeResponse(enrichWithErrorDetail(err).error);
      throw responseError({
        cause: err,
        message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
      });
    }
  }

  @Put('/email')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'Successful' })
  async updateEmail(
    @Body() updateEmailDto: UpdateEmailDto,
    @GetUser() user: User,
  ): Promise<void> {
    try {
      return await this.userService.updateEmail(updateEmailDto, user);
    } catch (err) {
      const errMsg = safeResponse(enrichWithErrorDetail(err).error);
      throw responseError({
        cause: err,
        message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
      });
    }
  }

  @Put('/phone')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'Successful' })
  async updatePhone(
    @Body() updatePhoneDto: UpdatePhoneDto,
    @GetUser() user: User,
  ): Promise<void> {
    try {
      return await this.userService.updatePhone(updatePhoneDto, user);
    } catch (err) {
      const errMsg = safeResponse(enrichWithErrorDetail(err).error);
      throw responseError({
        cause: err,
        message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
      });
    }
  }

  @Post('/send-event')
  async sendEvent() {
    return this.userService.sendEvent();
  }
}
