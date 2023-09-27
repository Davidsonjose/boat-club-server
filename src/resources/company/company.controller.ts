import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Company } from './company.entity';
import { ApiBadRequestResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCompanyDto } from 'src/dto/company/company.dto';
import { responseError, safeResponse } from 'src/helpers/http-response';
import { enrichWithErrorDetail } from 'src/helpers/axiosError';
import { systemResponses } from 'src/res/systemResponse';

@ApiTags('Company')
@Controller('company')
export class CompanyController {
  constructor(private companyService: CompanyService) {}
  @Post('/register')
  @ApiResponse({
    status: 201,
    description: 'registering company',
    type: CreateCompanyDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  async createCompany(
    @Body() createCompany: CreateCompanyDto,
  ): Promise<Company> {
    try {
      return this.companyService.createCompany(createCompany);
    } catch (err) {
      const errMsg = safeResponse(enrichWithErrorDetail(err).error);
      throw responseError({
        cause: err,
        message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
      });
    }
  }

  @Get('/:schemeId')
  @ApiResponse({
    status: 200,
    description: 'for getting your company details',
    type: Company,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  async getSingleCompany(
    @Param() { schemeId }: { schemeId: number },
  ): Promise<Company> {
    try {
      return this.companyService.getSingleCompany(schemeId);
    } catch (err) {
      const errMsg = safeResponse(enrichWithErrorDetail(err).error);
      throw responseError({
        cause: err,
        message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
      });
    }
  }
}
