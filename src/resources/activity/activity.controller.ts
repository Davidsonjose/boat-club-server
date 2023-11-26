import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ActivityService } from './activity.service';
import { HttpGuard } from 'src/guards/http.guard';
import { GetUser } from 'src/middleware/get-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { GetUserDto } from 'src/dto/auth/user.dto';
import {
  ActivityPayload,
  CreateActivityDto,
} from 'src/dto/activity/activity.dto';

@ApiTags('Activity')
@Controller('activity')
export class ActivityController {
  constructor() {}
  @Inject()
  private activityService: ActivityService;

  @Get('/initiate/:activityType')
  @UseGuards(HttpGuard, AuthGuard)
  @ApiOkResponse({ description: 'Successful', type: ActivityPayload })
  async initiateActivity(
    @Param() createActivityDto: CreateActivityDto,
    @GetUser() user: GetUserDto,
  ): Promise<ActivityPayload> {
    // console.log(activityType);
    return await this.activityService.initiateActivity(
      createActivityDto,
      user.id,
    );
  }
}
