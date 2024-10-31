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

@Injectable()
export class TourService {
  constructor(
    private userService: UserService,
    private databaseService: DatabaseService,
  ) {}

  async getTours(filterDto: FilterTourDto, user: GetUserDto) {
    try {
      const resp = await this.databaseService.getPrismaClient().tour.findMany({
        include: { tourCategory: true, onTheWay: true, location: true },
        skip: filterDto.skipResults,
        take: filterDto.takeResultAmount,
      });

      return resp;
    } catch (error) {
      throw error;
    }
  }

  async createTour(createTourDto: CreateTourDto) {
    try {
      const { tourCategoryId, locationId, otherLocationIds, ...tourData } =
        createTourDto;

      const resp = await this.databaseService.getPrismaClient().tour.create({
        data: {
          ...tourData,
          tourCategory: { connect: { id: tourCategoryId } },
          location: { connect: { id: locationId } },
          onTheWay: {
            connect: otherLocationIds.map((id) => ({ id })),
          },
        },
      });

      return resp;
    } catch (error) {
      throw error;
    }
  }

  async createTourCategory(createTourCategoryDto: CreateTourCategoryDto) {
    try {
      return await this.databaseService
        .getPrismaClient()
        .tourCategory.create({ data: { ...createTourCategoryDto } });
    } catch (error) {
      throw error;
    }
  }

  async getTourCategory(filtereTourCategoryDto: FilterTourCategoryDto) {
    try {
      return await this.databaseService
        .getPrismaClient()
        .tourCategory.findMany({
          include: { tours: true },
          skip: filtereTourCategoryDto.skipResults,
          take: filtereTourCategoryDto.takeResultAmount,
        });
    } catch (error) {
      throw error;
    }
  }

  async getSingleTourCategory(categoryId: number) {
    try {
      return await this.databaseService
        .getPrismaClient()
        .tourCategory.findFirst({
          include: { tours: true },
          where: { id: categoryId },
        });
    } catch (error) {
      throw error;
    }
  }

  async getSingleTourDetails(tourId: number) {
    try {
      return await this.databaseService.getPrismaClient().tour.findFirst({
        where: { id: tourId },
      });
    } catch (error) {
      throw error;
    }
  }

  //   async getMainWalletTransactions(
  //     filterDto: FilterTransactionsDto,
  //     user: GetUserDto,
  //   ) {
  //     try {
  //       const resp = await this.databaseService
  //         .getPrismaClient()
  //         .transaction.findMany({
  //           where: { walletType: WalletType.mainWallet, userId: user.id },
  //           // include: {},
  //           skip: filterDto.skipResults,
  //           take: filterDto.takeResultAmount,
  //         });

  //       return resp;
  //     } catch (error) {
  //       throw error;
  //     }
  //   }
}
