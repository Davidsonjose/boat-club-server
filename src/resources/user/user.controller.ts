import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Query,
  UseGuards,
  Logger,
  NotFoundException,
  Req,
  HttpException,
  HttpStatus,
  Put,
} from '@nestjs/common';

import { AuthGuard } from 'src/guards/auth.guard';
import { HttpGuard } from 'src/guards/http.guard';

import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/middleware/get-user.decorator';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import {
  CreateUserDto,
  EmailVerifiedDto,
  GetUserDto,
  SignInUserDto,
  UpdateEmailDto,
  UpdatePasswordDto,
  UpdatePhoneDto,
  UpdateUserDto,
} from 'src/dto/auth/user.dto';
import {
  responseError,
  responseOk,
  safeResponse,
} from 'src/helpers/http-response';
import { systemResponses } from 'src/res/systemResponse';
import { enrichWithErrorDetail } from 'src/helpers/axiosError';
import { AuthService } from '../auth/auth.service';
@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(
    private readonly usersService: UserService,

    private authService: AuthService,
  ) {}

  @Get('/')
  @UseGuards(HttpGuard, AuthGuard)
  async findOne(@Param() id: number, @GetUser() user: GetUserDto) {
    try {
      const resp = await this.usersService.findOne(user.id);

      if (!resp) {
        throw new NotFoundException(`User with id ${id} was not found`);
      }

      return responseOk({
        data: resp,
        message: `Retrieved user detail`,
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

  // @Post('/test-otp')
  // async testOtp() {
  //   await this.usersService.sendMyOtp('davidsonjosee313@gmail.com');
  // }

  @Put('/email_verified')
  @UseGuards(HttpGuard)
  async emailVerified(@Body() emailVerifiedDto: EmailVerifiedDto) {
    await this.usersService.emailVerified(emailVerifiedDto.email);
  }

  @Put('/')
  @UseGuards(HttpGuard, AuthGuard)
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: GetUserDto,
  ) {
    try {
      return await this.usersService.updateUser(updateUserDto, user.id);
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

  @Put('/change_password')
  @UseGuards(HttpGuard, AuthGuard)
  @ApiOkResponse({ description: 'Successful' })
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @GetUser() user: User,
  ): Promise<void> {
    try {
      return this.usersService.updatePassword(updatePasswordDto, user);
    } catch (err) {
      const errMsg = safeResponse(enrichWithErrorDetail(err).error);
      throw responseError({
        cause: err,
        message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
      });
    }
  }

  @Put('/email')
  @UseGuards(HttpGuard, AuthGuard)
  @ApiOkResponse({ description: 'Successful' })
  async updateEmail(
    @Body() updateEmailDto: UpdateEmailDto,
    @GetUser() user: User,
  ): Promise<void> {
    try {
      return await this.usersService.updateEmail(updateEmailDto, user);
    } catch (err) {
      const errMsg = safeResponse(enrichWithErrorDetail(err).error);
      throw responseError({
        cause: err,
        message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
      });
    }
  }

  @Put('/phone')
  @UseGuards(HttpGuard, AuthGuard)
  @ApiOkResponse({ description: 'Successful' })
  async updatePhone(
    @Body() updatePhoneDto: UpdatePhoneDto,
    @GetUser() user: User,
  ): Promise<void> {
    try {
      return await this.usersService.updatePhone(updatePhoneDto, user);
    } catch (err) {
      const errMsg = safeResponse(enrichWithErrorDetail(err).error);
      throw responseError({
        cause: err,
        message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
      });
    }
  }
}
