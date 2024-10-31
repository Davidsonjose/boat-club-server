import {
  Controller,
  Get,
  Param,
  UseGuards,
  Logger,
  Query,
  Post,
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
  GetAllTourCategoryResponseDto,
  GetAllTourResponseDto,
  GetSingleTourCategoryResponseDto,
  GetSingleTourResponseDto,
} from 'src/dto/tour';
import { NewService } from './news.service';
import {
  CreateNewsCategoryDto,
  CreateNewsDto,
  FilterNewsCategoryDto,
  FilterNewsDto,
  GetAllNewsCategoryResponseDto,
  GetAllNewsResponseDto,
  GetNewsDetailsResponseDto,
  GetSingleNewsCategoryResponseDto,
} from 'src/dto/news';
@Controller('news')
@ApiTags('news')
export class TourController {
  constructor(private readonly newService: NewService) {}

  @Get('/')
  @UseGuards(HttpGuard, AuthGuard)
  @ApiOkResponse({
    description: 'Successful',
    type: GetAllNewsResponseDto,
  })
  async getAllNews(
    @Query() filterDto: FilterNewsDto,
    @GetUser() user: GetUserDto,
  ) {
    try {
      const resp = await this.newService.getAllNews(filterDto, user);
      return responseOk({
        data: resp,
        message: `Retrieved all news`,
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
    type: GetAllNewsCategoryResponseDto,
  })
  async getAllNewsCategory(
    @Query() filterDto: FilterNewsCategoryDto,
    @GetUser() user: GetUserDto,
  ) {
    try {
      const resp = await this.newService.getNewsCategory(filterDto);
      return responseOk({
        data: resp,
        message: `Retrieved all news category`,
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
    type: GetSingleNewsCategoryResponseDto,
  })
  async getSingleNewsCategory(
    @GetUser() user: GetUserDto,
    @Param('id') id: number,
  ) {
    try {
      const resp = await this.newService.getSingleNewsCategory(id);
      return responseOk({
        data: resp,
        message: `Retrieved all single news category`,
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
  async getNewsDetails(@GetUser() user: GetUserDto, @Param('id') id: number) {
    try {
      const resp = await this.newService.getSingleNewsDetails(id);
      return responseOk({
        data: resp,
        message: `Retrieved all single news details`,
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
  async createNews(@GetUser() user: GetUserDto, createDto: CreateNewsDto) {
    try {
      const resp = await this.newService.createNews(createDto);
      return responseOk({
        data: resp,
        message: `Created news successfully`,
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
  async createNewsCategory(
    @GetUser() user: GetUserDto,
    createDto: CreateNewsCategoryDto,
  ) {
    try {
      const resp = await this.newService.createNewsCategory(createDto);
      return responseOk({
        data: resp,
        message: `Created news category successfully`,
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
