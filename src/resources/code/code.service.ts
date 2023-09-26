import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CodeStatus } from './dto/code-status.dto';
import { Code } from './code.entity';

@Injectable()
export class CodeService {
  constructor(
    @InjectRepository(Code)
    private codeRepository: Repository<Code>,
  ) {}

  async createCode(code: number): Promise<Code> {
    // console.log(code);
    console.log(code);
    if (!code) {
      throw new UnauthorizedException('Unautorized Access');
    }

    const singlecode = await this.getSingleCode(code);
    if (singlecode) {
      throw new UnauthorizedException('Unautorized Access');
    }
    const newcode: Code = this.codeRepository.create({
      code,
      status: CodeStatus.NOT_USED,
    });
    await this.codeRepository.save(newcode);
    return newcode;
  }

  async getSingleCode(code: number): Promise<Code> {
    const singlecode = this.codeRepository.findOne({ where: { code } });

    if (!singlecode) {
      return;
      // throw new UnauthorizedException('Unautorized Access');
    }

    return singlecode;
  }
}
