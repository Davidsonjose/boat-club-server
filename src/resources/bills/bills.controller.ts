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
import { BillService } from './bills.service';
import {
  SpecDataPlansExternal,
  SpecDataProvidersExternal,
} from 'src/services/system-spec/dto';
@Controller('bill')
@ApiTags('bill')
export class BillController {
  constructor(private readonly billService: BillService) {}

  //   @Get('/')
  //   @UseGuards(HttpGuard, AuthGuard)
  //   async getKycDetails(@GetUser() user: GetUserDto) {
  //     try {
  //       const resp = await this.kycService.getKyc(user.id);

  //       return responseOk({
  //         data: resp,
  //         message: `Retrieved kyc details`,
  //       });
  //     } catch (err: any) {
  //       const errMsg = safeResponse(err);

  //       Logger.error(err);

  //       throw responseError({
  //         cause: err,
  //         message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
  //       });
  //     }
  //   }
  @Get('/airtime/providers')
  @ApiOkResponse({ description: 'Successful', type: [SpecDataPlansExternal] })
  // @UseGuards(HttpGuard, AuthGuard)
  async getAirtimeProvider() {
    try {
      const resp = await this.billService.getAirtimeProviders();

      return responseOk({
        data: resp,
        message: `Retrieved airtime providers`,
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

  @Get('/data/providers')
  @ApiOkResponse({
    description: 'Successful',
    type: [SpecDataProvidersExternal],
  })
  // @UseGuards(HttpGuard, AuthGuard)
  async getDataProviders() {
    try {
      const resp = await this.billService.getDataProviders();

      return responseOk({
        data: resp,
        message: `Retrieved data providers`,
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

  @Get('/data/plan/:billerId')
  @ApiOkResponse({
    description: 'Successful',
    type: [SpecDataPlansExternal],
  })
  // @UseGuards(HttpGuard, AuthGuard)
  async getDataPlan(@Param('billerId') billerId: number) {
    try {
      const resp = await this.billService.getDataPlans(billerId);

      return responseOk({
        data: resp,
        message: `Retrieved data providers`,
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
