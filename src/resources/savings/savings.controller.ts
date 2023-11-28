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
import { CreateGoalBasedLoanDto, GetUserDto } from 'src/dto/auth/user.dto';
import { SavingsService } from './savings.service';
import {
  CreateFixedSavingDto,
  CreateTargetSavingsDto,
  FilterSavingsTransactionsDto,
  GetFixedSavingDto,
  GetSpendAndSaveDto,
  GetTargetSavingDto,
} from 'src/dto/savings';
@Controller('savings')
@ApiTags('savings')
export class SavingsController {
  constructor(
    private readonly usersService: UserService,
    private savingsService: SavingsService,
  ) {}

  @Get('/fixedSavings')
  @UseGuards(HttpGuard, AuthGuard)
  async getAllFixedSavings(@GetUser() user: GetUserDto) {
    try {
      const resp = await this.savingsService.getAllFixedSavings(user.id);
      return responseOk({
        data: resp,
        message: `Retrieved all fixed savings`,
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

  @Get('/targetSavings')
  @UseGuards(HttpGuard, AuthGuard)
  async getTargetSavings(@GetUser() user: GetUserDto) {
    try {
      const resp = await this.savingsService.getAllTargetSavings(user.id);
      return responseOk({
        data: resp,
        message: `Retrieved all target savings`,
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

  @Get('/spendAndSave')
  @UseGuards(HttpGuard, AuthGuard)
  async getSpendAndSave(@GetUser() user: GetUserDto) {
    try {
      const resp = await this.savingsService.getAllSpendAndSaveSavings(user.id);
      return responseOk({
        data: resp,
        message: `Retrieved all spend and save savings`,
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
  @Get('/spendAndSave/:spendAndSaveId')
  @UseGuards(HttpGuard, AuthGuard)
  async getSpendAndSaveDetails(
    @GetUser() user: GetUserDto,
    @Param() getSpendAndSave: GetSpendAndSaveDto,
  ) {
    try {
      const resp = await this.savingsService.getSpendAndSaveSavingsDetails(
        getSpendAndSave.spendAndSaveId,
        user.id,
      );
      return responseOk({
        data: resp,
        message: `Retrieved spend and save savings details`,
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
  @Get('/targetSavings/:targetSavingId')
  @UseGuards(HttpGuard, AuthGuard)
  async getTargetSavingDetails(
    @GetUser() user: GetUserDto,
    @Param() getTargetSavingDto: GetTargetSavingDto,
  ) {
    try {
      const resp = await this.savingsService.getSpendAndSaveSavingsDetails(
        getTargetSavingDto.targetSavingId,
        user.id,
      );
      return responseOk({
        data: resp,
        message: `Retrieved target savings details`,
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
  @Get('/fixedSavings/:fixedSavingId')
  @UseGuards(HttpGuard, AuthGuard)
  async getFixedSavings(
    @GetUser() user: GetUserDto,
    @Param() getFixedSavingDto: GetFixedSavingDto,
  ) {
    try {
      const resp = await this.savingsService.getSpendAndSaveSavingsDetails(
        getFixedSavingDto.fixedSavingId,
        user.id,
      );
      return responseOk({
        data: resp,
        message: `Retrieved fixed savings details`,
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

  @Get('/transactions')
  @UseGuards(HttpGuard, AuthGuard)
  async getSavingsTransaction(
    @GetUser() user: GetUserDto,
    @Query() filterTransactionDto: FilterSavingsTransactionsDto,
  ) {
    try {
      const resp = await this.savingsService.getSavingsTransaction(
        filterTransactionDto,
        user.id,
      );
      return responseOk({
        data: resp,
        message: `Retrieved all spend and save savings`,
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

  @Post('/fixedSaving')
  @UseGuards(HttpGuard, AuthGuard)
  async startGoalBasedLoan(
    @GetUser() user: GetUserDto,
    @Body() createFixedSvingDto: CreateFixedSavingDto,
  ) {
    try {
      const resp = await this.savingsService.createFixedSaving(
        createFixedSvingDto,
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
  @Post('/targetSaving')
  @UseGuards(HttpGuard, AuthGuard)
  async startTargetSaving(
    @GetUser() user: GetUserDto,
    @Body() createTargetSavingDto: CreateTargetSavingsDto,
  ) {
    try {
      const resp = await this.savingsService.createTargetSavings(
        createTargetSavingDto,
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

  @Post('/spendAndSave')
  @UseGuards(HttpGuard, AuthGuard)
  async spendAndSave(@GetUser() user: GetUserDto) {
    try {
      const resp = await this.savingsService.createSpendAndSave(user.id);
      return responseOk({
        data: resp,
        message: `Successful`,
      });
    } catch (error) {
      throw error;
    }
  }
  @Put('/spendAndSave/activate')
  @UseGuards(HttpGuard, AuthGuard)
  async activateSpendAndSave(@GetUser() user: GetUserDto) {
    try {
      const resp = await this.savingsService.activateSpendAndSave(user.id);
      return responseOk({
        data: resp,
        message: `Successful`,
      });
    } catch (error) {
      throw error;
    }
  }
  @Put('/spendAndSave/deactivate')
  @UseGuards(HttpGuard, AuthGuard)
  async deactivateSpendAndSave(@GetUser() user: GetUserDto) {
    try {
      const resp = await this.savingsService.deactivateSpendAndSave(user.id);
      return responseOk({
        data: resp,
        message: `Successful`,
      });
    } catch (error) {
      throw error;
    }
  }
}
