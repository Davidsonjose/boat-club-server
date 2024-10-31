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

import { TourService } from './tour.service';
import {
  CreateTourCategoryDto,
  CreateTourDto,
  FilterTourCategoryDto,
  FilterTourDto,
  GetAllTourCategoryResponseDto,
  GetAllTourResponseDto,
  GetSingleTourCategoryResponseDto,
  GetSingleTourResponseDto,
} from 'src/dto/tour';
@Controller('tour')
@ApiTags('tour')
export class TourController {
  constructor(private readonly tourService: TourService) {}

  @Get('/')
  @UseGuards(HttpGuard, AuthGuard)
  @ApiOkResponse({
    description: 'Successful',
    type: GetAllTourResponseDto,
  })
  async getAllTours(
    @Query() filterDto: FilterTourDto,
    @GetUser() user: GetUserDto,
  ) {
    try {
      const resp = await this.tourService.getTours(filterDto, user);
      return responseOk({
        data: resp,
        message: `Retrieved all tours`,
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

  @Get('/category')
  @UseGuards(HttpGuard, AuthGuard)
  @ApiOkResponse({
    description: 'Successful',
    type: GetAllTourCategoryResponseDto,
  })
  async getAllTourCategory(
    @Query() filterDto: FilterTourCategoryDto,
    @GetUser() user: GetUserDto,
  ) {
    try {
      const resp = await this.tourService.getTourCategory(filterDto);
      return responseOk({
        data: resp,
        message: `Retrieved all tours category`,
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

  @Get('/category/:id')
  @UseGuards(HttpGuard, AuthGuard)
  @ApiOkResponse({
    description: 'Successful',
    type: GetSingleTourCategoryResponseDto,
  })
  async getSingleTourCategory(
    @GetUser() user: GetUserDto,
    @Param('id') id: number,
  ) {
    try {
      const resp = await this.tourService.getSingleTourCategory(id);
      return responseOk({
        data: resp,
        message: `Retrieved all single tour category`,
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
    type: GetSingleTourResponseDto,
  })
  async getTourDetails(@GetUser() user: GetUserDto, @Param('id') id: number) {
    try {
      const resp = await this.tourService.getSingleTourDetails(id);
      return responseOk({
        data: resp,
        message: `Retrieved all single tour details`,
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
  async createTour(@GetUser() user: GetUserDto, createTourDto: CreateTourDto) {
    try {
      const resp = await this.tourService.createTour(createTourDto);
      return responseOk({
        data: resp,
        message: `Created tour successfully`,
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

  @Post('/category')
  @UseGuards(HttpGuard, AuthGuard)
  async createTourCategory(
    @GetUser() user: GetUserDto,
    createTourDto: CreateTourCategoryDto,
  ) {
    try {
      const resp = await this.tourService.createTourCategory(createTourDto);
      return responseOk({
        data: resp,
        message: `Created tour category successfully`,
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

  //   @Get('/targetSavings')
  //   @UseGuards(HttpGuard, AuthGuard)
  //   async getTargetSavings(@GetUser() user: GetUserDto) {
  //     try {
  //       const resp = await this.savingsService.getAllTargetSavings(user.id);
  //       return responseOk({
  //         data: resp,
  //         message: `Retrieved all target savings`,
  //       });
  //     } catch (err: any) {
  //       const errMsg = safeResponse(err);

  //       Logger.error(err);

  //       throw responseError({
  //         cause: err,
  //         message: `${systemResponses.EN.DEFAULT_ERROR_RESPONSE}: ${errMsg}`,
  //       });
  //     }
  //   }
}
