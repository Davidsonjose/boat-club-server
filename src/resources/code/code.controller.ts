import { Body, Controller, Param, Post } from '@nestjs/common';
import { CodeService } from './code.service';
import { Code } from './code.entity';
import { MinLength } from 'class-validator';
import { ApiExcludeController, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CodeActionPaylod, MakeActionDto } from 'src/dto/otp';

// @ApiExcludeController()
@ApiTags('Automation Code')
@Controller('code')
export class CodeController {
  constructor(private codeService: CodeService) {}

  // @Post('/create')
  // createCode(@Body() body): Promise<Code> {
  //   const { code } = body;
  //   return this.codeService.createCode(code);
  // }

  @Post('/action/:actionType')
  @ApiOkResponse({ description: 'Successful', type: CodeActionPaylod })
  async actionCode(@Param() actionDto: MakeActionDto) {
    return;
  }
}
