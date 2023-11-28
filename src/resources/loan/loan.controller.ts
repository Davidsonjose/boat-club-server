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
import {
  CreateGoalBasedLoanDto,
  CreatePayDayLoanDto,
  GetUserDto,
} from 'src/dto/auth/user.dto';
import { LoanService } from './loan.service';
@Controller('loan')
@ApiTags('loan')
export class LoanController {
  constructor(
    private readonly usersService: UserService,
    private loanService: LoanService,
  ) {}

  @Get('/status')
  @UseGuards(HttpGuard, AuthGuard)
  async getLoanStatus(@GetUser() user: GetUserDto) {
    try {
      const resp = await this.loanService.loanStatus(user.id);
      return responseOk({
        data: resp,
        message: `Retrieved loan status`,
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

  @Post('/goalBasedLoan')
  @UseGuards(HttpGuard, AuthGuard)
  async startGoalBasedLoan(
    @GetUser() user: GetUserDto,
    @Body() createGoalBasedLoanDto: CreateGoalBasedLoanDto,
  ) {
    try {
      const resp = await this.loanService.createGoalBasedLoan(
        createGoalBasedLoanDto,
        user.id,
      );
      return responseOk({
        data: resp,
        message: `Successful`,
      });
    } catch (error) {
      throw error;
    }
  }

  @Post('/payDayLoan')
  @UseGuards(HttpGuard, AuthGuard)
  async startPayDayLoan(
    @GetUser() user: GetUserDto,
    @Body() createPayDayLoan: CreatePayDayLoanDto,
  ) {
    try {
      const resp = await this.loanService.createPayDayLoan(
        createPayDayLoan,
        user.id,
      );
      return responseOk({
        data: resp,
        message: `Successful`,
      });
    } catch (error) {
      throw error;
    }
  }
}
