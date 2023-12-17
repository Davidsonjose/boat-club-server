import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { DatabaseService } from 'src/services/database/database.service';
import { GetUserDto } from 'src/dto/auth/user.dto';
import { WalletType } from '@prisma/client';
import { FilterTransactionsDto } from 'src/dto/transaction';

@Injectable()
export class TransactionService {
  constructor(
    private userService: UserService,
    private databaseService: DatabaseService,
  ) {}

  async getMainWalletTransactions(
    filterDto: FilterTransactionsDto,
    user: GetUserDto,
  ) {
    try {
      const resp = await this.databaseService
        .getPrismaClient()
        .transaction.findMany({
          where: { walletType: WalletType.mainWallet, userId: user.id },
          // include: {},
          skip: filterDto.skipResults,
          take: filterDto.takeResultAmount,
        });

      return resp;
    } catch (error) {
      throw error;
    }
  }

  async getLoanWalletTransactions(
    filterDto: FilterTransactionsDto,
    user: GetUserDto,
  ) {
    try {
      const resp = await this.databaseService
        .getPrismaClient()
        .transaction.findMany({
          where: { walletType: WalletType.loanWallet, userId: user.id },
          // include: {},
          skip: filterDto.skipResults,
          take: filterDto.takeResultAmount,
        });
      return resp;
    } catch (error) {
      throw error;
    }
  }

  async getSavingsWalletTransaction(
    filterDto: FilterTransactionsDto,
    user: GetUserDto,
  ) {
    try {
      const resp = await this.databaseService
        .getPrismaClient()
        .transaction.findMany({
          where: { walletType: WalletType.savingWallet, userId: user.id },
          skip: filterDto.skipResults,
          take: filterDto.takeResultAmount,
        });
      return resp;
    } catch (error) {
      throw error;
    }
  }
  async getAllTransactions(filterDto: FilterTransactionsDto, user: GetUserDto) {
    try {
      const resp = await this.databaseService
        .getPrismaClient()
        .transaction.findMany({
          where: { userId: user.id },
          skip: filterDto.skipResults,
          take: filterDto.takeResultAmount,
        });
      return resp;
    } catch (error) {
      throw error;
    }
  }
}
