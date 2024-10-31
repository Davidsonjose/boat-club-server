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
  CreateClubLocationDto,
  FilterClubLocationDto,
} from 'src/dto/club-location';

@Injectable()
export class ClubLocationService {
  constructor(
    private userService: UserService,
    private databaseService: DatabaseService,
  ) {}

  async getClubLocations(filterDto: FilterTourDto, user: GetUserDto) {
    try {
      const resp = await this.databaseService
        .getPrismaClient()
        .clubLocation.findMany({
          include: { tours: true },
          skip: filterDto.skipResults,
          take: filterDto.takeResultAmount,
        });

      return resp;
    } catch (error) {
      throw error;
    }
  }

  async createLocation(createTourDto: CreateClubLocationDto) {
    try {
      const resp = await this.databaseService
        .getPrismaClient()
        .clubLocation.create({
          data: {
            ...createTourDto,
          },
        });

      return resp;
    } catch (error) {
      throw error;
    }
  }

  async getSingleLocation(clubLocationId: number) {
    try {
      return await this.databaseService
        .getPrismaClient()
        .tourCategory.findFirst({
          include: { tours: true },
          where: { id: clubLocationId },
        });
    } catch (error) {
      throw error;
    }
  }
}
