import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Company } from './company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Code } from '../code/code.entity';
import { CodeStatus } from '../code/dto/code-status.dto';
import { CreateCompanyDto } from 'src/dto/company/company.dto';
import { CompanyRepository } from 'src/repository/company.repository';

@Injectable()
export class CompanyService {
  private logger = new Logger('TaskService', { timestamp: true });

  constructor(
    private readonly companyRepository: CompanyRepository,
    @InjectRepository(Code)
    private readonly codeRepository: Repository<Code>,
  ) {}

  async getSingleCompany(id: string): Promise<Company> {
    try {
      const find = await this.companyRepository.getSingleCompany(id);

      if (!find) {
        this.logger.error(
          `User trying to use endpoint to get company enpoint with a invalid company id: ${id}}`,
        );
        throw new NotFoundException(`Invalid Scheme`);
      }

      return find;
    } catch (error) {
      throw error;
    }
  }

  async createCompany(companyDto: CreateCompanyDto): Promise<Company> {
    try {
      const { name, code } = companyDto;
      const find = await this.codeRepository.findOne({
        where: { code: Number(code) },
      });

      if (!find) {
        this.logger.error(
          `Failed to get code. Filters: ${JSON.stringify(companyDto)}`,
        );
        throw new UnauthorizedException();
      }
      if (find.status == CodeStatus.USED) {
        throw new UnauthorizedException();
      }
      find.status = CodeStatus.USED;
      await this.codeRepository.save(find);

      return await this.companyRepository.createCompany(companyDto);
    } catch (error) {
      throw error;
    }
  }
}
