import {
  BadRequestException,
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
    private companyRepository: CompanyRepository,
    @InjectRepository(Code)
    private readonly codeRepository: Repository<Code>,
  ) {}

  async getSingleCompany(id: number): Promise<Company> {
    try {
      // console.log(id);
      //check for chevy view
      // if (id == '6dee3295-683f-4512-8576-b817689788e2') {
      //   await this.companyRepository.updateCompanyId(
      //     '6dee3295-683f-4512-8576-b817689788e2',
      //     '4e5822d4-a08c-4942-affe-148c1077b289',
      //   );
      //   // const find = await this.companyRepository.getSingleCompany("4e5822d4-a08c-4942-affe-148c1077b289");
      //   // if(find){
      //   //   find.id = "6dee3295-683f-4512-8576-b817689788e2"
      //   //   return await this.companyRepository.updateCompanyId()
      //   //   // await this.companyRepository.
      //   // }
      // }
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
