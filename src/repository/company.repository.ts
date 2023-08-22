import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserLocationDto } from 'src/dto/auth/user.dto';
import { CreateCompanyDto } from 'src/dto/company/company.dto';
import { CreateNotificationDto } from 'src/dto/notification/notifications.dto';
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
    return this.companyRepository.findOne({
      where: { id: companyId },
    });
  }

  async createCompany(createCompanyDto: CreateCompanyDto) {
    const { name, address, code, email, phone, dialCode } = createCompanyDto;
    const company: Company = this.companyRepository.create({
      name,
      address,
      email,
      phone,
      dialCode,
      // id: '0bfb725a-f575-4bb1-8ddb-ca0265b213a2',
    });

    await this.companyRepository.save(company);
    return company;
  }
}
