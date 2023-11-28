import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { DatabaseService } from 'src/services/database/database.service';
import { LoanStatus } from '@prisma/client';
import { CreateGoalBasedLoanDto } from 'src/dto/auth/user.dto';
import { ContributionService } from '../contribution/contribution.service';

@Injectable()
export class LoanService {
  constructor(
    private userService: UserService,
    private databaseService: DatabaseService,
    private contributionService: ContributionService,
  ) {}

  async createLoan(userId: number): Promise<void> {
    // Check if the user has an active loan
    const existingLoan = await this.databaseService.loan.findFirst({
      where: { userId },
    });

    if (existingLoan) {
      throw new Error('User already has an active loan');
    }

    // Create a new loan
    const loan = await this.databaseService.loan.create({
      data: {
        User: { connect: { id: userId } },
        Wallet: { connect: { userId } },
      },
    });

    return;
  }

  async getMainLoan(userId: number) {
    try {
      const loan = await this.databaseService.loan.findFirst({
        where: { userId },
        include: { PaydayLoan: true, GoalBasedLoan: true },
      });
      return loan;
    } catch (error) {
      throw error;
    }
  }

  async loanStatus(userId: number) {
    try {
      const resp = await this.databaseService.loan.findFirst({
        where: { active: true, userId },
        include: { PaydayLoan: true, GoalBasedLoan: true },
      });
      return resp;
    } catch (error) {
      throw error;
    }
  }

  async createGoalBasedLoan(
    dto: CreateGoalBasedLoanDto,
    userId: number,
  ): Promise<void> {
    const { amount, startDate, endDate, documents } = dto;

    await this.validateLoan(userId);
    const joinContribution =
      await this.databaseService.joinContribution.findFirst({
        where: { userId },
        include: { Contribution: true },
      });

    // const amount = joinContribution.Contribution.amo

    // Calculate interest amount (20% of loan amount)
    const interestAmount = amount * 0.2;

    // Set the interest rate and loan status based on your logic
    const interestRate = 0.2; // 20%

    // Create the goal-based loan
    await this.databaseService.goalBasedLoan.create({
      data: {
        amount,
        interestAmount,
        documents,
        paydayDueDate: endDate,
        endDate,
        startDate,
        targetDate: endDate,
        ongoing: false, // Set to true by default, adjust based on your logic
        interestRate,
        Loan: {
          connect: { userId },
        },
      },
    });

    // Set the active status for the user's loan
    await this.databaseService.loan.update({
      where: { userId },
      data: { active: true },
    });
  }

  async createPayDayLoan(
    dto: CreateGoalBasedLoanDto,
    userId: number,
  ): Promise<void> {
    const { amount, startDate, endDate, documents } = dto;

    await this.validateLoan(userId);
    const joinContribution =
      await this.databaseService.joinContribution.findFirst({
        where: { userId },
        include: { Contribution: true },
      });

    // const amount = joinContribution.Contribution.amo

    // Calculate interest amount (20% of loan amount)
    const interestAmount = amount * 0.2;

    // Set the interest rate and loan status based on your logic
    const interestRate = 0.2; // 20%

    // Create the goal-based loan
    await this.databaseService.paydayLoan.create({
      data: {
        amount,
        interestAmount,
        documents,
        paydayDueDate: endDate,
        endDate,
        startDate,
        targetDate: endDate,
        ongoing: false, // Set to true by default, adjust based on your logic
        interestRate,
        Loan: {
          connect: { userId },
        },
      },
    });

    // Set the active status for the user's loan
    await this.databaseService.loan.update({
      where: { userId },
      data: { active: true },
    });
  }

  async validateLoan(userId: number) {
    try {
      const loan = await this.getMainLoan(userId);
      if (loan.active == true) {
        throw new BadRequestException('You have a ongoing loan. ');
      }
    } catch (error) {
      throw error;
    }
  }

  //   async createGoalBasedLoan(
  //     dto: CreateGoalBasedLoanDto,
  //     userId: number,
  //   ): Promise<void> {
  //     const { amount, targetDate, startDate, endDate, paydayDueDate, documents } =
  //       dto;

  //     const joinContribution =
  //       await this.databaseService.joinContribution.findFirst({
  //         where: { userId },
  //         include: { Contribution: true },
  //       });

  //     // const amount = joinContribution.Contribution.amo

  //     // Calculate interest amount (20% of loan amount)
  //     const interestAmount = amount * 0.2;

  //     // Set the interest rate and loan status based on your logic
  //     const interestRate = 0.2; // 20%

  //     // Create the goal-based loan
  //     await this.databaseService.goalBasedLoan.create({
  //       data: {
  //         amount,
  //         interestAmount,
  //         documents,
  //         paydayDueDate,
  //         endDate,
  //         startDate,
  //         targetDate,
  //         ongoing: false, // Set to true by default, adjust based on your logic
  //         interestRate,
  //         Loan: {
  //           connect: { userId },
  //         },
  //       },
  //     });

  //     // Set the active status for the user's loan
  //     await this.databaseService.loan.update({
  //       where: { userId },
  //       data: { active: true },
  //     });
  //   }

  //   async validateLoan() {
  //     try {
  //         if(){}
  //     } catch (error) {
  //       throw error;
  //     }
  //   }
}
