import { Controller, Get } from '@nestjs/common';

@Controller('cron')
export class CronController {
  @Get('ping')
  ping(): string {
    return 'Server is active';
  }
}
