import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
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

@Controller('contribution')
@ApiTags('contribution')
export class ContributionController {
  constructor(private contributionService: ContributionService) {}

  @Post()
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

  @Post('/join/:contributionId')
  async join(
    @GetUser() user: GetUserDto,
    @Param() joinContributionParamDto: JoinContributionParamDto,
    @Body() joinContributionDto: JoinContributionDto,
  ): Promise<any> {
    try {
      const info: JoinContributionDto = {
        ...joinContributionDto,
        contributionId: joinContributionParamDto.contributionId,
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
