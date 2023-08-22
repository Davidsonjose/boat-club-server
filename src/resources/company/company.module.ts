import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { UserRepository } from 'src/repository/user.repository';
import { LocationModule } from '../location/location.module';
import { SettingsModule } from '../settings/settings.module';
import { PassportModule } from '@nestjs/passport';
import { Company } from './company.entity';
import { CompanyRepository } from 'src/repository/company.repository';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { Code } from '../code/code.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Company, Code]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [CompanyService, CompanyRepository],
  controllers: [CompanyController],
  exports: [CompanyService],
})
export class CompanyModule {}
