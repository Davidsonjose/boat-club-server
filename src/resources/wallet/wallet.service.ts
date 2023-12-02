import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';

import { Location, User } from '@prisma/client';
import { UserService } from '../user/user.service';
import { DatabaseService } from 'src/services/database/database.service';
import { GetUserDto } from 'src/dto/auth/user.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class WalletService {
  constructor(
    private userService: UserService,
    private databaseService: DatabaseService,
  ) {}

  async mainWallet(user: GetUserDto) {
    try {
      const resp = await this.databaseService.mainWallet.findFirst({
        where: { userId: user.id },
        include: { Transactions: true },
      });
      return resp;
    } catch (error) {
      throw error;
    }
  }

  async createMainWallet(user: GetUserDto) {
    try {
      // Generate a new unique account number
      let accountNumber: string;
      let isAccountNumberUnique = false;

      // Keep generating a new account number until it is unique
      while (!isAccountNumberUnique) {
        accountNumber = uuidv4().replace(/-/g, '').slice(0, 10); // Generate a 10-character account number

        // Check if the generated account number already exists
        const existingWallet = await this.databaseService.mainWallet.findFirst({
          where: { accountNumber: accountNumber?.toString() },
        });

        isAccountNumberUnique = !existingWallet;
      }

      const resp = await this.databaseService.mainWallet.create({
        data: {
          balance: 0,
          accountName: `${user.firstName} ${user.lastName}`,
          accountNumber,
          User: {
            connect: { id: user.id },
          },
        },
      });

      return resp;
    } catch (error) {
      throw error;
    }
  }

  async loanWallet(user: GetUserDto) {
    try {
      const resp = await this.databaseService.loanWallet.findFirst({
        where: { userId: user.id },
        include: { Transactions: true },
      });
      return resp;
    } catch (error) {
      throw error;
    }
  }
  async createLoanWallet(user: GetUserDto) {
    try {
      const resp = await this.databaseService.loanWallet.create({
        data: {
          User: {
            connect: { id: user.id },
          },
          balance: 0,
        },
      });
      return resp;
    } catch (error) {
      throw error;
    }
  }

  async savingsWallet(user: GetUserDto) {
    try {
      const resp = await this.databaseService.savingsWallet.findFirst({
        where: { userId: user.id },
        include: { Transactions: true },
      });
      return resp;
    } catch (error) {
      throw error;
    }
  }
  async createSavingsWallet(user: GetUserDto) {
    try {
      const resp = await this.databaseService.savingsWallet.create({
        data: {
          User: {
            connect: { id: user.id },
          },
          balance: 0,
        },
      });
      return resp;
    } catch (error) {
      throw error;
    }
  }
}
