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

import {
  responseError,
  responseOk,
  safeResponse,
} from 'src/helpers/http-response';
import { systemResponses } from 'src/res/systemResponse';
import { UserService } from '../user/user.service';
import { GetUserDto } from 'src/dto/auth/user.dto';
import { WalletService } from './wallet.service';
@Controller('wallet')
@ApiTags('wallet')
export class WalletController {
  constructor(
    private readonly usersService: UserService,

    private walletService: WalletService,
  ) {}

  @Get('/main-wallet')
  @UseGuards(HttpGuard, AuthGuard)
  async findOne(@GetUser() user: GetUserDto) {
    try {
      const resp = await this.walletService.mainWallet(user);

      if (!resp) {
        throw new NotFoundException(`Wallet  not found`);
      }

      return responseOk({
        data: resp,
        message: `Retrieved main wallet detail`,
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

  // @Get('/loan')
  // @UseGuards(HttpGuard, AuthGuard)
  // async loanWallet(@Param() id: number, @GetUser() user: GetUserDto) {
  //   try {
  //     const resp = await this.walletService.loanWallet(user);

  //     if (!resp) {
  //       throw new NotFoundException(`Wallet  not found`);
  //     }

  //     return responseOk({
  //       data: resp,
  //       message: `Retrieved loan wallet detail`,
  //     });
  //   } catch (err: any) {
  //     const errMsg = safeResponse(err);

  //     Logger.error(err);

  //     throw responseError({
  //       cause: err,
  //       message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
  //     });
  //   }
  // }

  // @Get('/savings')
  // @UseGuards(HttpGuard, AuthGuard)
  // async savingsWallet(@Param() id: number, @GetUser() user: GetUserDto) {
  //   try {
  //     const resp = await this.walletService.savingsWallet(user);

  //     if (!resp) {
  //       throw new NotFoundException(`Wallet  not found`);
  //     }

  //     return responseOk({
  //       data: resp,
  //       message: `Retrieved savings wallet detail`,
  //     });
  //   } catch (err: any) {
  //     const errMsg = safeResponse(err);

  //     Logger.error(err);

  //     throw responseError({
  //       cause: err,
  //       message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
  //     });
  //   }
  // }
}
