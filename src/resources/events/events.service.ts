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
import { CreateEventDto, FilterClubEventsDto } from 'src/dto/club-events';

@Injectable()
export class EventsService {
  constructor(
    private userService: UserService,
    private databaseService: DatabaseService,
  ) {}

  async getAllEvents(filterDto: FilterClubEventsDto, user: GetUserDto) {
    try {
      const resp = await this.databaseService.getPrismaClient().event.findMany({
        include: { location: true },
        skip: filterDto.skipResults,
        take: filterDto.takeResultAmount,
      });

      return resp;
    } catch (error) {
      throw error;
    }
  }

  async createEvent(createClubEventDto: CreateEventDto) {
    try {
      const resp = await this.databaseService.getPrismaClient().event.create({
        data: {
          ...createClubEventDto,
        },
      });

      return resp;
    } catch (error) {
      throw error;
    }
  }

  async getSingleEvent(eventId: number) {
    try {
      return await this.databaseService.getPrismaClient().event.findFirst({
        include: { location: true },
        where: { id: eventId },
      });
    } catch (error) {
      throw error;
    }
  }
}
