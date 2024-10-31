import {
  Controller,
  Get,
  Param,
  UseGuards,
  Logger,
  NotFoundException,
  Query,
  Post,
  Body,
  Put,
} from '@nestjs/common';

import { AuthGuard } from 'src/guards/auth.guard';
import { HttpGuard } from 'src/guards/http.guard';

import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/middleware/get-user.decorator';

import {
  responseError,
  responseOk,
  safeResponse,
} from 'src/helpers/http-response';
import { systemResponses } from 'src/res/systemResponse';
import { GetUserDto } from 'src/dto/auth/user.dto';

import { EventsService } from './events.service';
import {
  CreateEventDto,
  FilterClubEventsDto,
  GetAllClubEventsResponseDto,
  GetClubEventsDetailsResponseDto,
} from 'src/dto/club-events';
@Controller('events')
@ApiTags('events')
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  @Get('/')
  @UseGuards(HttpGuard, AuthGuard)
  @ApiOkResponse({
    description: 'Successful',
    type: GetAllClubEventsResponseDto,
  })
  async getAllEvents(
    @Query() filterDto: FilterClubEventsDto,
    @GetUser() user: GetUserDto,
  ) {
    try {
      const resp = await this.eventService.getAllEvents(filterDto, user);
      return responseOk({
        data: resp,
        message: `Retrieved all club events`,
      });
    } catch (err: any) {
      const errMsg = safeResponse(err);

      Logger.error(err);

      throw responseError({
        cause: err,
        message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
      });
    }
  }

  @Get('/:id')
  @UseGuards(HttpGuard, AuthGuard)
  @ApiOkResponse({
    description: 'Successful',
    type: GetClubEventsDetailsResponseDto,
  })
  async getEventDetails(@GetUser() user: GetUserDto, @Param('id') id: number) {
    try {
      const resp = await this.eventService.getSingleEvent(id);
      return responseOk({
        data: resp,
        message: `Retrieved single event details`,
      });
    } catch (err: any) {
      const errMsg = safeResponse(err);

      Logger.error(err);

      throw responseError({
        cause: err,
        message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
      });
    }
  }

  @Post('/')
  @UseGuards(HttpGuard, AuthGuard)
  async createTour(
    @GetUser() user: GetUserDto,
    createEventDto: CreateEventDto,
  ) {
    try {
      const resp = await this.eventService.createEvent(createEventDto);
      return responseOk({
        data: resp,
        message: `Created event successfully`,
      });
    } catch (err: any) {
      const errMsg = safeResponse(err);

      Logger.error(err);

      throw responseError({
        cause: err,
        message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
      });
    }
  }
}
