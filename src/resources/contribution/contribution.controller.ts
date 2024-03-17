import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ContributionService } from './contribution.service';
import { responseError, safeResponse } from 'src/helpers/http-response';
import { systemResponses } from 'src/res/systemResponse';
import {
  CreateContributionDto,
  JoinContributionDto,
  JoinContributionParamDto,
  MakePaymentContributionDto,
  MakePaymentResDto,
} from 'src/dto/contribution';
import { Contribution } from '@prisma/client';
import { GetUser } from 'src/middleware/get-user.decorator';
import { GetUserDto } from 'src/dto/auth/user.dto';
import { HttpGuard } from 'src/guards/http.guard';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('contribution')
@ApiTags('contribution')
export class ContributionController {
  constructor(private contributionService: ContributionService) {}

  @Post()
  @UseGuards(HttpGuard, AuthGuard)
  async createContribution(
    @Body() createContributionDto: CreateContributionDto,
  ): Promise<any> {
    try {
      return await this.contributionService.createContribution(
        createContributionDto,
      );
    } catch (err) {
      const errMsg = safeResponse(err);

      Logger.error(err);

      throw responseError({
        cause: err,
        message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
      });
    }
  }

  @Get()
  @UseGuards(HttpGuard, AuthGuard)
  async getAllContribution(): Promise<any> {
    try {
      return await this.contributionService.getContribution();
    } catch (err) {
      const errMsg = safeResponse(err);

      Logger.error(err);

      throw responseError({
        cause: err,
        message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
      });
    }
  }

  @Get('/:contributionId')
  @UseGuards(HttpGuard, AuthGuard)
  async getContributionDetails(
    @Param() joinContributionParamDto: JoinContributionParamDto,
  ): Promise<any> {
    try {
      return await this.contributionService.getContributionDetails(
        joinContributionParamDto.contributionId,
      );
    } catch (err) {
      const errMsg = safeResponse(err);

      Logger.error(err);

      throw responseError({
        cause: err,
        message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
      });
    }
  }

  @Get('/joined-transactions/:contributionId')
  @UseGuards(HttpGuard, AuthGuard)
  async getJoinedContributionDetails(
    @Param() joinContributionParamDto: JoinContributionParamDto,
    @GetUser() user: GetUserDto,
  ): Promise<any> {
    try {
      return await this.contributionService.getUserJoinContributionTransaction(
        joinContributionParamDto.contributionId,
        user.id,
      );
    } catch (err) {
      const errMsg = safeResponse(err);

      Logger.error(err);

      throw responseError({
        cause: err,
        message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
      });
    }
  }

  @Post('/join/:contributionId')
  @UseGuards(HttpGuard, AuthGuard)
  async join(
    @GetUser() user: GetUserDto,
    @Param() joinContributionParamDto: JoinContributionParamDto,
    @Body() joinContributionDto: JoinContributionDto,
  ): Promise<any> {
    try {
      const info: JoinContributionDto = {
        ...joinContributionDto,
        contributionId: Number(joinContributionParamDto.contributionId),
      };
      return await this.contributionService.joinContribution(info, user.id);
    } catch (err) {
      const errMsg = safeResponse(err);

      Logger.error(err);

      throw responseError({
        cause: err,
        message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
      });
    }
  }

  @Post('/make-payment')
  @UseGuards(HttpGuard, AuthGuard)
  @ApiOkResponse({ type: MakePaymentResDto })
  async makePayment(
    @GetUser() user: GetUserDto,
    @Body() makePaymentContributionDto: MakePaymentContributionDto,
  ): Promise<any> {
    try {
      const info: MakePaymentContributionDto = {
        ...makePaymentContributionDto,
        userId: user.id,
      };
      return await this.contributionService.markPayment(info);
    } catch (err) {
      const errMsg = safeResponse(err);

      Logger.error(err);

      throw responseError({
        cause: err,
        message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
      });
    }
  }
}
