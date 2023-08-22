import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller()
export class AppController {
  @Get()
  getRoot(): string {
    return 'Welcome to QUIXCEL Estates Server API v1';
  }
}
