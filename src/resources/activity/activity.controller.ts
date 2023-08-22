import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/middleware/get-user.decorator';
import { User } from '../auth/user.entity';
import {
  ActivityPayload,
  CreateActivityDto,
} from 'src/dto/activity/activity.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Activity')
@Controller('activity')
export class activityController {
  constructor(private activityService: ActivityService) {}

  @Get('/initiate/:activityType')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'Successful', type: ActivityPayload })
  async initiateActivity(
    @Param() createActivityDto: CreateActivityDto,
    @GetUser() user: User,
  ): Promise<ActivityPayload> {
    // console.log(activityType);
    return await this.activityService.intiateActivity(createActivityDto, user);
  }
}
