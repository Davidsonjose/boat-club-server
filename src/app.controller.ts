import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { UserService } from './resources/user/user.service';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private userService: UserService) {}
  @Get()
  getRoot(): string {
    return 'Welcome to QUIXCEL Estates Server API v1';
  }

  @Post('/request-deletion')
  async requestAccountDeletion(
    @Body() { email, companyId }: { email: string; companyId: number },
  ): Promise<any> {
    return await this.userService.requestAccountDeletion(email, companyId);
  }
}
