import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { DatabaseService } from 'src/services/database/database.service';
import { GetUserDto } from 'src/dto/auth/user.dto';
import { WalletType } from '@prisma/client';
import { FilterTransactionsDto } from 'src/dto/transaction';
import {
  CreateTourCategoryDto,
  CreateTourDto,
  FilterTourCategoryDto,
  FilterTourDto,
} from 'src/dto/tour';
import {
  CreateNewsCategoryDto,
  CreateNewsDto,
  FilterNewsCategoryDto,
  FilterNewsDto,
} from 'src/dto/news';

@Injectable()
export class NewService {
  constructor(
    private userService: UserService,
    private databaseService: DatabaseService,
  ) {}

  async getAllNews(filterDto: FilterNewsDto, user: GetUserDto) {
    try {
      const resp = await this.databaseService.getPrismaClient().news.findMany({
        include: { category: true },
        skip: filterDto.skipResults,
        take: filterDto.takeResultAmount,
      });

      return resp;
    } catch (error) {
      throw error;
    }
  }

  async createNews(createTourDto: CreateNewsDto) {
    try {
      const { categoryId, ...tourData } = createTourDto;

      const resp = await this.databaseService.getPrismaClient().news.create({
        data: {
          ...tourData,
          category: { connect: { id: categoryId } },
        },
      });

      return resp;
    } catch (error) {
      throw error;
    }
  }

  async createNewsCategory(createNewsCategoryDto: CreateNewsCategoryDto) {
    try {
      return await this.databaseService
        .getPrismaClient()
        .newsCategory.create({ data: { ...createNewsCategoryDto } });
    } catch (error) {
      throw error;
    }
  }

  async getNewsCategory(filtereTourCategoryDto: FilterNewsCategoryDto) {
    try {
      return await this.databaseService
        .getPrismaClient()
        .newsCategory.findMany({
          include: { news: true },
          skip: filtereTourCategoryDto.skipResults,
          take: filtereTourCategoryDto.takeResultAmount,
        });
    } catch (error) {
      throw error;
    }
  }

  async getSingleNewsCategory(categoryId: number) {
    try {
      return await this.databaseService
        .getPrismaClient()
        .newsCategory.findFirst({
          include: { news: true },
          where: { id: categoryId },
        });
    } catch (error) {
      throw error;
    }
  }

  async getSingleNewsDetails(newsId: number) {
    try {
      return await this.databaseService.getPrismaClient().news.findFirst({
        where: { id: newsId },
      });
    } catch (error) {
      throw error;
    }
  }
}
