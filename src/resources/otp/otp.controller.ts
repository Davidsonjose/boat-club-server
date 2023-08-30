import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { OtpService } from './otp.service';
import { CreateOtpDto, OtpDataPayload, VerifyOtpDto } from 'src/dto/otp';
import { GetUser } from 'src/middleware/get-user.decorator';
import { User } from '../auth/user.entity';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Otp')
@Controller('otp')
export class OtpController {
  constructor(private otpService: OtpService) {}

  @Post()
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'Successful', type: OtpDataPayload })
  async SendOtp(@Body() createOtpDto: CreateOtpDto, @GetUser() user: User) {
    return await this.otpService.generateAndSendOtp({
      user: user,
      ...createOtpDto,
    });
  }

  @Post('/verify')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'Successful', type: OtpDataPayload })
  async VerifyOtp(@Body() verifyOtpDto: VerifyOtpDto, @GetUser() user: User) {
    return await this.otpService.verifyOtp({
      userId: user.id,
      ...verifyOtpDto,
    });
  }
}
