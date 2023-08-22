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

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'Successful', type: UserPayloadData })
  getSingleUser(@GetUser() user: any) {
    // console.log(user, 'here is user');
    return user;
    // this.userService.getSingleUser();
  }

  @Put('/email_verified')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'Successful', type: UserPayloadData })
  async verifyEmail(@GetUser() user: any) {
    return await this.userService.verifyEmail(user);
  }

  @Put('/phone_verified')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'Successful', type: UserPayloadData })
  async verifyPhone(@GetUser() user: any) {
    return await this.userService.verifyPhone(user);
  }
  @Get('/settings')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'Successful' })
  async getUserSetting(@GetUser() user: User): Promise<Settings> {
    return await this.userService.getUserSettings(user);
  }

  @Put('/pushNotificationToken')
  @UseGuards(AuthGuard())
  async pushNotificationToken(
    @GetUser() user: User,
    @Body() deviceToken: string,
  ) {
    return await this.userService.pushNotificationToken(deviceToken, user);
  }

  @Post('/verify_pwd')
  @UseGuards(AuthGuard())
  async verifyPassword(@GetUser() user: User, @Body() password: string) {
    return await this.userService.pushNotificationToken(password, user);
  }

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
    return await this.userService.updatePin(responseInfo);
  }
  @Put('/pin/verify')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'Successful' })
  async verifyPin(
    @Body() verifyPinDto: VerifyPinDto,
    @GetUser() user: User,
  ): Promise<void> {
    // const responseInfo = {
    //   pin: verifyPinDto.pin,
    //   user,
    //   activityHash: verifyPinDto.activityHash,
    // };
    return await this.userService.verifyPin(verifyPinDto, user);
  }

  @Put('/change_password')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'Successful' })
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.userService.updatePassword(updatePasswordDto, user);
  }

  @Put('')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'Successful' })
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @GetUser() user,
  ): Promise<void> {
    return this.userService.updateProfile(updateProfileDto, user);
  }

  @Put('/email')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'Successful' })
  async updateEmail(
    @Body() updateEmailDto: UpdateEmailDto,
    @GetUser() user: User,
  ): Promise<void> {
    return await this.userService.updateEmail(updateEmailDto, user);
  }

  @Put('/phone')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'Successful' })
  async updatePhone(
    @Body() updatePhoneDto: UpdatePhoneDto,
    @GetUser() user: User,
  ): Promise<void> {
    return await this.userService.updatePhone(updatePhoneDto, user);
  }
}
