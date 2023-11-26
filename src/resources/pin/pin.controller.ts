import {
  Controller,
  Post,
  Body,
  Param,
  Inject,
  Put,
  Logger,
  UseGuards,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { HttpGuard } from 'src/guards/http.guard';
import { GetUser } from 'src/middleware/get-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { GetUserDto, UpdatePinDto, VerifyPinDto } from 'src/dto/auth/user.dto';
import {
  responseError,
  responseOk,
  safeResponse,
} from 'src/helpers/http-response';
import { systemResponses } from 'src/res/systemResponse';
import { PinService } from './pin.service';
@Controller('pin')
@ApiTags('pin')
export class PinController {
  constructor() {}

  @Inject()
  private readonly pinService: PinService;

  @Put('')
  @UseGuards(HttpGuard, AuthGuard)
  async updatePin(
    @Body() updatePinDto: UpdatePinDto,
    @GetUser() user: GetUserDto,
  ): Promise<any> {
    try {
      const { pin } = updatePinDto;
      const res = await this.pinService.updatePin(user, updatePinDto);

      return responseOk({
        data: [],
        message: `Pin set successfully`,
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
  @Post('verify')
  @UseGuards(HttpGuard, AuthGuard)
  async verifyPin(
    @Body() verifyPinDto: VerifyPinDto,
    @GetUser() user: GetUserDto,
  ): Promise<any> {
    try {
      const { pin } = verifyPinDto;
      const res = await this.pinService.verifyPin(user, verifyPinDto);

      return responseOk({
        data: [],
        message: `Pin ok.`,
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

  @Post('test')
  @UseGuards(HttpGuard, AuthGuard)
  async testPin(@GetUser() user): Promise<any> {
    try {
      return user;
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
