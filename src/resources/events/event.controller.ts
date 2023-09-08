import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { EventService } from './event.service';
import { Events } from './events.entity';
import { GetUser } from 'src/middleware/get-user.decorator';
import { User } from '../auth/user.entity';
import { GetEventsDto, UserEventPayload } from 'src/dto/events';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('events')
@ApiTags('Events')
export class EventsController {
  constructor(private eventService: EventService) {}

  @Get('')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ description: 'Successful', type: UserEventPayload })
  async getRecentsEventdAuthGuard(
    @Query() getEventDto: GetEventsDto,
    @GetUser() user: User,
  ): Promise<Events[]> {
    const { page, pageSize } = getEventDto;
    return await this.eventService.getUserRecentEvents(user, page, pageSize);
  }
}
