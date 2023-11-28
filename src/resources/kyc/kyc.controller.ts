import {
  Controller,
  Get,
  Param,
  UseGuards,
  Logger,
  NotFoundException,
  Query,
  Post,
  Body,
} from '@nestjs/common';

import { AuthGuard } from 'src/guards/auth.guard';
import { HttpGuard } from 'src/guards/http.guard';

import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/middleware/get-user.decorator';

import {
  responseError,
  responseOk,
  safeResponse,
} from 'src/helpers/http-response';
import { systemResponses } from 'src/res/systemResponse';
import { UserService } from '../user/user.service';
import { GetUserDto } from 'src/dto/auth/user.dto';
import { kycService } from './kyc.service';
import { KycOneDto, KycThreeDto, KycTwoDto } from 'src/dto/kyc';
@Controller('kyc')
@ApiTags('kyc')
export class KycController {
  constructor(
    private readonly usersService: UserService,
    private kycService: kycService,
  ) {}

  @Get('/')
  @UseGuards(HttpGuard, AuthGuard)
  async getKycDetails(@GetUser() user: GetUserDto) {
    try {
      const resp = await this.kycService.getKyc(user.id);

      //   return responseOk({
      //     data: resp,
      //     message: `Retrieved kyc details`,
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

  @Post('/kyc1')
  @UseGuards(HttpGuard, AuthGuard)
  async startKycOne(@Body() kycOneDto: KycOneDto, @GetUser() user: GetUserDto) {
    try {
      return await this.kycService.startKyc1({
        ...kycOneDto,
        userId: user.id,
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

  @Post('/kyc2')
  @UseGuards(HttpGuard, AuthGuard)
  async startKycTwo(@Body() kycTwoDto: KycTwoDto, @GetUser() user: GetUserDto) {
    try {
      return await this.kycService.startKyc2({
        ...kycTwoDto,
        userId: user.id,
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

  @Post('/kyc3')
  @UseGuards(HttpGuard, AuthGuard)
  async startKycThree(
    @Body() kycThreeDto: KycThreeDto,
    @GetUser() user: GetUserDto,
  ) {
    try {
      return await this.kycService.startKyc3({
        ...kycThreeDto,
        userId: user.id,
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
