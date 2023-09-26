import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserLocationDto } from 'src/dto/auth/user.dto';
import { CreateCompanyDto } from 'src/dto/company/company.dto';
import { Company } from 'src/resources/company/company.entity';
import { Location } from 'src/resources/location/location.entity';
import { Notifications } from 'src/resources/notification/notification.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CompanyRepository {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async getSingleCompany(companyId: string): Promise<Company> {
    try {
      return this.companyRepository.findOne({
        where: { id: companyId },
      });
    } catch (error) {
      throw error;
    }
  }

  async createCompany(createCompanyDto: CreateCompanyDto) {
    try {
      const { name, address, code, email, phone, dialCode, logoUrl } =
        createCompanyDto;
      const company: Company = this.companyRepository.create({
        name: name?.toLowerCase(),
        address,
        email: email?.toLowerCase(),
        phone,
        dialCode,
        logoUrl,
        // id: '0bfb725a-f575-4bb1-8ddb-ca0265b213a2',
      });

      await this.companyRepository.save(company);
      return company;
    } catch (error) {
      throw error;
    }
  }

  async updateCompanyId(oldCompanyId: string, newCompanyId: string) {
    // return;
    const singleCompany = await this.getSingleCompany(newCompanyId);
    if (singleCompany) {
      singleCompany.id = oldCompanyId;
      await this.companyRepository.save(singleCompany);
    } else {
      throw new BadRequestException('From davidson but two');
    }
  }
}
