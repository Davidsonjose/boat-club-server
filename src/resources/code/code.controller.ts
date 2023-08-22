import { Body, Controller, Post } from '@nestjs/common';
import { CodeService } from './code.service';
import { Code } from './code.entity';
import { MinLength } from 'class-validator';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('code')
export class CodeController {
  constructor(private codeService: CodeService) {}

  @Post('/create')
  createCode(@Body() body): Promise<Code> {
    const { code } = body;
    return this.codeService.createCode(code);
  }
}
