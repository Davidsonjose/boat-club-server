import {
  Controller,
  Get,
  Param,
  UseGuards,
  Logger,
  NotFoundException,
  Query,
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
import { TransactionService } from './transaction.service';
import { FilterTransactionsDto } from 'src/dto/transaction';
@Controller('transactions')
@ApiTags('transactions')
export class TransactionController {
  constructor(
    private readonly usersService: UserService,
    private transactionService: TransactionService,
  ) {}

  @Get('/main-wallet')
  @UseGuards(HttpGuard, AuthGuard)
  async findOne(
    @Query() filterDto: FilterTransactionsDto,
    @GetUser() user: GetUserDto,
  ) {
    try {
      const resp = await this.transactionService.getMainWalletTransactions(
        filterDto,
        user,
      );

      if (!resp) {
        throw new NotFoundException(`Transactions`);
      }

      return responseOk({
        data: resp,
        message: `Retrieved main transactions`,
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
  // async loanWallet(
  //   @Query() filterDto: FilterTransactionsDto,
  //   @GetUser() user: GetUserDto,
  // ) {
  //   try {
  //     const resp = await this.transactionService.getLoanWalletTransactions(
  //       filterDto,
  //       user,
  //     );

  //     if (!resp) {
  //       throw new NotFoundException(`Transactions`);
  //     }

  //     return responseOk({
  //       data: resp,
  //       message: `Retrieved loan transactions`,
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
  @Get('/')
  @UseGuards(HttpGuard, AuthGuard)
  async allTransactions(
    @Query() filterDto: FilterTransactionsDto,
    @GetUser() user: GetUserDto,
  ) {
    try {
      const resp = await this.transactionService.getAllTransactions(
        filterDto,
        user,
      );

      if (!resp) {
        throw new NotFoundException(`Transactions`);
      }

      return responseOk({
        data: resp,
        message: `Retrieved all transactions`,
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

  // @Get('/savings')
  // @UseGuards(HttpGuard, AuthGuard)
  // async savingsWallet(
  //   @Query() filterDto: FilterTransactionsDto,
  //   @GetUser() user: GetUserDto,
  // ) {
  //   try {
  //     const resp = await this.transactionService.getSavingsWalletTransaction(
  //       filterDto,
  //       user,
  //     );

  //     if (!resp) {
  //       throw new NotFoundException(`Transactions`);
  //     }

  //     return responseOk({
  //       data: resp,
  //       message: `Retrieved savings transactions`,
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
