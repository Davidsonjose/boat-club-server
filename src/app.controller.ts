import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor() {}
  @Get()
  getRoot(): string {
    return 'Welcome to QUIXCEL Estates Server API v1';
  }

  @Post('/request-deletion')
  async requestAccountDeletion(
    @Body() { email, companyId }: { email: string; companyId: number },
  ): Promise<any> {
    // return await this.userService.requestAccountDeletion(email, companyId);
  }
}
