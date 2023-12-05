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
@Controller('bill')
@ApiTags('bill')
export class BillController {
  constructor(private readonly usersService: UserService) {}

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
}
