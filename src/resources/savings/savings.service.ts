import { BadRequestException, Injectable } from '@nestjs/common';
import { FixedSaving, SpendAndSave, TargetSaving } from '@prisma/client';
import { GetUserDto } from 'src/dto/auth/user.dto';
import {
  CreateFixedSavingDto,
  CreateTargetSavingsDto,
  FilterSavingsTransactionsDto,
  PaymentFrequencyEnum,
  SavingTransactionEnum,
} from 'src/dto/savings';
import { FilterTransactionsDto } from 'src/dto/transaction';
import { DatabaseService } from 'src/services/database/database.service';

@Injectable()
export class SavingsService {
  constructor(private databaseService: DatabaseService) {}

  async initialiseUserSavings(savingsWalletId: number, user: GetUserDto) {
    try {
      const newsavings = await this.databaseService.saving.create({
        data: {
          User: {
            connect: { id: user.id },
          },
          Wallet: {
            connect: { id: savingsWalletId },
          },
        },
      });
      return newsavings;
    } catch (error) {
      throw error;
    }
  }

  async getUserSavings(userId: number) {
    try {
      const resp = await this.databaseService.saving.findFirst({
        where: { userId },
        include: {},
      });
      return resp;
    } catch (error) {
      throw error;
    }
  }

  async getAllTargetSavings(userId: number): Promise<TargetSaving[]> {
    try {
      // const info = await this.databaseService
      const userSavings = await this.getUserSavings(userId);

      const info = await this.databaseService.targetSaving.findMany({
        where: { savingId: userSavings.id },
      });
      return info;
    } catch (error) {
      throw error;
    }
  }

  async getAllFixedSavings(userId: number): Promise<FixedSaving[]> {
    try {
      const userSavings = await this.getUserSavings(userId);

      const info = await this.databaseService.fixedSaving.findMany({
        where: { savingId: userSavings.id },
      });
      return info;
    } catch (error) {
      throw error;
    }
  }
  async getAllSpendAndSaveSavings(userId: number): Promise<SpendAndSave[]> {
    try {
      const userSavings = await this.getUserSavings(userId);

      const info = await this.databaseService.spendAndSave.findMany({
        where: { savingId: userSavings.id },
      });
      return info;
    } catch (error) {
      throw error;
    }
  }

  async getSpendAndSaveSavingsDetails(
    id: number,
    userId: number,
  ): Promise<SpendAndSave> {
    try {
      const userSavings = await this.getUserSavings(userId);

      const info = await this.databaseService.spendAndSave.findFirst({
        where: { savingId: userSavings.id, id },
      });
      return info;
    } catch (error) {
      throw error;
    }
  }

  async getFixedSavingsDetails(
    id: number,
    userId: number,
  ): Promise<FixedSaving> {
    try {
      const userSavings = await this.getUserSavings(userId);

      const info = await this.databaseService.fixedSaving.findFirst({
        where: { savingId: userSavings.id, id },
      });
      return info;
    } catch (error) {
      throw error;
    }
  }
  async getTargetSavingsDetails(
    id: number,
    userId: number,
  ): Promise<TargetSaving> {
    try {
      const userSavings = await this.getUserSavings(userId);

      const info = await this.databaseService.targetSaving.findFirst({
        where: { savingId: userSavings.id, id },
      });
      return info;
    } catch (error) {
      throw error;
    }
  }

  async getSavingsTransaction(
    filterTransactionDto: FilterSavingsTransactionsDto,
    userId: number,
  ) {
    try {
      //   const alltransactions;
      if (
        filterTransactionDto.savingType == SavingTransactionEnum.SPEND_AND_SAVE
      ) {
        return await this.getSpendAndSaveTransaction(
          filterTransactionDto,
          userId,
        );
      } else if (
        filterTransactionDto.savingType == SavingTransactionEnum.FIXED_SAVING
      ) {
        return await this.getFixedSavingsTransactions(
          filterTransactionDto,
          userId,
        );
      } else if (
        filterTransactionDto.savingType == SavingTransactionEnum.TARGET_SAVING
      ) {
        return await this.getTargetSavingsTransaction(
          filterTransactionDto,
          userId,
        );
      } else {
        return await this.getAllSavingsTransactions(
          filterTransactionDto,
          userId,
        );
      }
    } catch (error) {
      throw error;
    }
  }

  async getSpendAndSaveTransaction(
    filterTransactionDto: FilterSavingsTransactionsDto,
    userId: number,
  ) {
    try {
      const savingsWallet = await this.databaseService.savingsWallet.findFirst({
        where: { userId },
        include: { Saving: true },
      });
      const info = await this.databaseService.spendAndSave.findFirst({
        where: { savingId: savingsWallet.id },
        include: {
          Transactions: {
            skip: filterTransactionDto.skipResults,
            take: filterTransactionDto.takeResultAmount,
          },
        },
      });
      return info.Transactions;
    } catch (error) {
      throw error;
    }
  }
  async getFixedSavingsTransactions(
    filterTransactionDto: FilterSavingsTransactionsDto,
    userId: number,
  ) {
    try {
      const savingsWallet = await this.databaseService.savingsWallet.findFirst({
        where: { userId },
        include: { Saving: true },
      });
      const info = await this.databaseService.fixedSaving.findFirst({
        where: { savingId: savingsWallet.id },
        include: {
          Transactions: {
            skip: filterTransactionDto.skipResults,
            take: filterTransactionDto.takeResultAmount,
          },
        },
      });
      return info.Transactions;
    } catch (error) {
      throw error;
    }
  }
  async getTargetSavingsTransaction(
    filterTransactionDto: FilterSavingsTransactionsDto,
    userId: number,
  ) {
    try {
      const savingsWallet = await this.databaseService.savingsWallet.findFirst({
        where: { userId },
        include: { Saving: true },
      });
      const info = await this.databaseService.targetSaving.findFirst({
        where: { savingId: savingsWallet.id },
        include: {
          Transactions: {
            skip: filterTransactionDto.skipResults,
            take: filterTransactionDto.takeResultAmount,
          },
        },
      });
      return info.Transactions;
    } catch (error) {
      throw error;
    }
  }
  async getAllSavingsTransactions(
    filterTransactionDto: FilterSavingsTransactionsDto,
    userId: number,
  ) {
    try {
      const savingsWallet = await this.databaseService.savingsWallet.findFirst({
        where: { userId },
        include: {
          Saving: true,
          Transactions: {
            skip: filterTransactionDto.skipResults,
            take: filterTransactionDto.takeResultAmount,
          },
        },
      });
      // const info = await this.databaseService.savingsWallet.findFirst({
      //   where: { savingId: savingsWallet.id },
      //   include: {
      //     // Transactions: {
      //   skip: filterTransactionDto.skipResults,
      //   take: filterTransactionDto.takeResultAmount,
      //     // },
      //   },
      // });
      return savingsWallet.Transactions;
    } catch (error) {
      throw error;
    }
  }

  // saving logic begin

  //fixed savings
  async createFixedSaving(
    dto: CreateFixedSavingDto,
    userId: number,
  ): Promise<any> {
    const { amount, startDate, endDate, title } = dto;

    // Check for ongoing fixed savings
    const ongoingFixedSavings = await this.databaseService.fixedSaving.findMany(
      {
        where: {
          ongoing: true,
          saving: {
            userId,
          },
        },
      },
    );

    if (ongoingFixedSavings.length > 0) {
      throw new BadRequestException(
        'There is an ongoing fixed saving. Cannot create a new one.',
      );
    }

    // Calculate interest (7% of the saving amount)
    const interest = 0.07 * amount;

    // Create the fixed saving
    return await this.databaseService.fixedSaving.create({
      data: {
        amount,
        interest,
        startDate,
        endDate,
        title,
        ongoing: true,
        saving: {
          connect: { userId },
        },
      },
    });
  }

  //spend and save
  async createSpendAndSave(userId: number): Promise<any> {
    // Check for ongoing fixed savings
    const ongoingSpendAndSave =
      await this.databaseService.spendAndSave.findFirst({
        where: {
          ongoing: true,
          saving: {
            userId,
          },
        },
      });

    if (ongoingSpendAndSave) {
      throw new BadRequestException(
        'There is an ongoing fixed saving. Cannot create a new one.',
      );
    }

    // Create the fixed saving
    const info = await this.databaseService.spendAndSave.create({
      data: {
        percentage: '5',
        ongoing: true,
        saving: {
          connect: { userId },
        },
      },
    });
    return info;
  }

  //spend and save
  async deactivateSpendAndSave(userId: number): Promise<any> {
    // Check for ongoing fixed savings
    const ongoingSpendAndSave =
      await this.databaseService.spendAndSave.findFirst({
        where: {
          ongoing: true,
          saving: {
            userId,
          },
        },
      });

    if (ongoingSpendAndSave.ongoing == false) {
      throw new BadRequestException('Spend and save is currently deactivated');
    }

    await this.databaseService.spendAndSave.update({
      where: {
        id: ongoingSpendAndSave.id,
      },
      data: {
        ongoing: false,
      },
    });
  }

  async activateSpendAndSave(userId: number): Promise<any> {
    // Check for ongoing fixed savings
    const ongoingSpendAndSave =
      await this.databaseService.spendAndSave.findFirst({
        where: {
          ongoing: true,
          saving: {
            userId,
          },
        },
      });

    if (ongoingSpendAndSave.ongoing == true) {
      throw new BadRequestException('Spend and save is currently activated');
    }

    await this.databaseService.spendAndSave.update({
      where: {
        id: ongoingSpendAndSave.id,
      },
      data: {
        ongoing: true,
      },
    });
  }

  //spend and save

  //fixed savings
  async createTargetSavings(
    dto: CreateTargetSavingsDto,
    userId: number,
  ): Promise<any> {
    const { startDate, endDate, targetAmount, title, paymentFrequency } = dto;

    // Check for ongoing fixed savings
    const ongoingFixedSavings =
      await this.databaseService.targetSaving.findMany({
        where: {
          ongoing: true,
          saving: {
            userId,
          },
        },
      });

    if (ongoingFixedSavings.length > 0) {
      throw new BadRequestException(
        'There is an ongoing target savings. Cannot create a new one.',
      );
    }

    // Calculate frequent amount
    const frequentAmount = this.calculateFrequentAmount(
      startDate,
      endDate,
      Number(targetAmount),
      paymentFrequency,
    );

    // Calculate interest (7% of the saving amount)
    const interest = 0.07 * Number(targetAmount);

    // Create the fixed saving
    return await this.databaseService.targetSaving.create({
      data: {
        targetAmount: Number(targetAmount),
        interest,
        startDate,
        endDate,
        frequentAmount,
        title,
        ongoing: true,
        paymentFrequency,
        saving: {
          connect: { userId },
        },
      },
    });
  }

  // calculate target amount based on you

  // Function to calculate the frequent amount
  calculateFrequentAmount(
    startDate: Date,
    endDate: Date,
    targetAmount: number,
    paymentFrequency: PaymentFrequencyEnum,
  ): number {
    // Calculate the total number of payment intervals based on the payment frequency
    const totalIntervals = this.calculateTotalIntervals(
      startDate,
      endDate,
      paymentFrequency,
    );

    // Ensure that the totalIntervals is greater than 0 to avoid division by zero
    if (totalIntervals > 0) {
      // Calculate the frequent amount required to achieve the target amount
      return targetAmount / totalIntervals;
    } else {
      throw new Error('Invalid date range or payment frequency');
    }
  }

  // Function to calculate the total number of payment intervals
  calculateTotalIntervals(
    startDate: Date,
    endDate: Date,
    paymentFrequency: PaymentFrequencyEnum,
  ): number {
    const daysInMonth = 30; // Assume an average of 30 days in a month

    switch (paymentFrequency) {
      case PaymentFrequencyEnum.DAILY:
        return this.calculateDaysDifference(startDate, endDate);

      case PaymentFrequencyEnum.WEEKLY:
        return this.calculateWeeksDifference(startDate, endDate);

      case PaymentFrequencyEnum.MONTHLY:
        return this.calculateMonthsDifference(startDate, endDate);

      default:
        throw new Error('Invalid payment frequency');
    }
  }

  // Helper function to calculate the difference in days between two dates
  calculateDaysDifference(startDate: Date, endDate: Date): number {
    const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
    return Math.round(
      Math.abs((endDate.getTime() - startDate.getTime()) / oneDay),
    );
  }

  // Helper function to calculate the difference in weeks between two dates
  calculateWeeksDifference(startDate: Date, endDate: Date): number {
    const daysInWeek = 7;
    return Math.floor(
      this.calculateDaysDifference(startDate, endDate) / daysInWeek,
    );
  }

  // Helper function to calculate the difference in months between two dates
  calculateMonthsDifference(startDate: Date, endDate: Date): number {
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth();

    let totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth);

    // Adjust if the end day of the end month is earlier than the start day of the start month
    if (endDate.getDate() < startDate.getDate()) {
      totalMonths -= 1;
    }

    return totalMonths;
  }
}
