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

import {
  FilterTourDto,
  GetAllTourResponseDto,
  GetSingleTourResponseDto,
} from 'src/dto/tour';
import { ClubLocationService } from './club-location.service';
import {
  CreateClubLocationDto,
  GetAllClubLocationResponseDto,
  GetSingleClubLocationResponseDto,
} from 'src/dto/club-location';
@Controller('club-location')
@ApiTags('club-location')
export class ClubLocationController {
  constructor(private readonly tourService: ClubLocationService) {}

  @Get('/')
  @UseGuards(HttpGuard, AuthGuard)
  @ApiOkResponse({
    description: 'Successful',
    type: GetAllClubLocationResponseDto,
  })
  async getAllTours(
    @Query() filterDto: FilterTourDto,
    @GetUser() user: GetUserDto,
  ) {
    try {
      const resp = await this.tourService.getClubLocations(filterDto, user);
      return responseOk({
        data: resp,
        message: `Retrieved all club locations`,
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
    type: GetSingleClubLocationResponseDto,
  })
  async getLocationDetails(
    @GetUser() user: GetUserDto,
    @Param('id') id: number,
  ) {
    try {
      const resp = await this.tourService.getSingleLocation(id);
      return responseOk({
        data: resp,
        message: `Retrieved single club location details`,
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
    createLocationDto: CreateClubLocationDto,
  ) {
    try {
      const resp = await this.tourService.createLocation(createLocationDto);
      return responseOk({
        data: resp,
        message: `Created location successfully`,
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
