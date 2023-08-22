import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Company } from './company.entity';
import { ApiBadRequestResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCompanyDto } from 'src/dto/company/company.dto';

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
    return this.companyService.createCompany(createCompany);
  }

  @Get('/:schemeId')
  @ApiResponse({
    status: 200,
    description: 'for getting your company details',
    type: Company,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  async getSingleCompany(@Param('id') scheme: string): Promise<Company> {
    return this.companyService.getSingleCompany(scheme);
  }
}
