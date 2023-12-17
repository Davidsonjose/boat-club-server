// contribution.service.ts

import { Injectable } from '@nestjs/common';
import {
  Contribution,
  ContributionUserMonth,
  ParticipantType,
  Transaction,
  TransactionStatus,
  TransactionType,
  WalletType,
} from '@prisma/client';
import {
  CreateContributionDto,
  JoinContributionDto,
  MakePaymentContributionDto,
  MakePaymentResDto,
} from 'src/dto/contribution';
import { DatabaseService } from 'src/services/database/database.service';
import * as uuid from 'uuid';

@Injectable()
export class ContributionService {
  constructor(private databaseService: DatabaseService) {}

  async getContribution() {
    return await this.databaseService.getPrismaClient().contribution.findMany({
      include: {
        joinContributions: {
          include: {
            contributionUserMonth: true,
            ServerUser: true,
            User: true,
          },
        },
      },
    });
  }
  async getContributionDetails(contributionId: number) {
    return await this.databaseService.getPrismaClient().contribution.findFirst({
      where: { id: contributionId },
      include: {
        joinContributions: {
          include: {
            contributionUserMonth: true,
            ServerUser: true,
            User: true,
          },
        },
        contributionMonths: true,
      },
    });
  }
  async createContribution(info: CreateContributionDto): Promise<Contribution> {
    try {
      //   console.log(info.startDate);
      const {
        startDate,
        monthlyAmount,
        participants,
        totalServer,
        contributionName,
      } = info;
      const startDateFormated = new Date(startDate);
      console.log(startDateFormated);
      // Calculate fixedMonth based on the start date
      const fixedMonth = startDateFormated.toLocaleDateString('en-US', {
        month: 'long',
      });

      // Calculate endMonth based on the start date and total participants
      const endMonth = new Date(info.startDate);
      endMonth.setMonth(endMonth.getMonth() + info.participants + 1); // Add an extra month for the fixed first month

      // Calculate monthlyOutput for the current month

      // Generate an array of months
      const months = this.generateMonths(startDateFormated, endMonth);

      console.log(months);
      // Calculate totalUser based on total participants and totalServer
      const totalUser = info.participants - info.totalServer;

      // calculate total participants
      const totalParticipants = totalUser + info.totalServer;

      const currentMonthOutput = this.calculateMonthlyOutput(
        totalParticipants,
        info.monthlyAmount,
      );

      const formattedEndMonth = endMonth.toLocaleDateString('en-US');
      // Create the contribution in the database
      const createdContribution = await this.databaseService
        .getPrismaClient()
        .contribution.create({
          data: {
            contributionMonths: {
              create: months.map((month, index) => ({
                ...month,
                fixedMonth: index === 0, // Set fixedMonth to true for the first month
              })),
            },
            monthlyOutput: currentMonthOutput,
            monthlyAmount: info.monthlyAmount,
            participants: totalParticipants,
            totalUser,
            fixedMonth: startDateFormated,
            endDate: endMonth,
            endMonth: endMonth,
            startDate: startDateFormated,
            contributionName,
            totalServer,
          },
        });

      if (!createdContribution) {
        throw new Error('Failed to create the contribution');
      }

      // Automatically create joinContribution records for servers
      const serverParticipants = await this.databaseService
        .getPrismaClient()
        .joinContribution.findMany({
          where: {
            contributionId: createdContribution.id,
            participantType: 'SERVER',
          },
        });

      // Check if there are fewer server participants than the specified totalServer
      if (serverParticipants.length < info.totalServer) {
        // Calculate the remaining server spaces to be created
        const remainingServerSpaces =
          info.totalServer - serverParticipants.length;

        // Generate an array of server records to be created
        const serversToCreate = Array.from(
          { length: remainingServerSpaces },
          async (_, index) => {
            // Create a new ServerUser
            const createdServerUser = await this.databaseService
              .getPrismaClient()
              .serverUser.create({
                data: { serverUID: `serverUID_${index}` },
              });

            // Create the joinContribution record for the server
            const newServer = await this.databaseService
              .getPrismaClient()
              .joinContribution.create({
                data: {
                  Contribution: { connect: { id: createdContribution.id } },
                  participantType: 'SERVER' as ParticipantType,
                  participantNumber: index + 1, // 1-indexed position for servers
                  isServer: true,
                  ServerUser: { connect: { id: createdServerUser.id } }, // Connect the ServerUser
                  contributionUserMonth: {
                    create: months.map((month) => ({
                      month: month.month,
                      paid: false,
                      monthOfCollection: false,
                    })),
                  },
                },
              });
            console.log(newServer, 'new server');
          },
        );

        return createdContribution;
      }
    } catch (error) {
      // Handle errors (log or throw further)
      throw error;
      //   throw new Error(`Error creating contribution: ${error.message}`);
    }
  }

  async determineParticipants(contributionId: number): Promise<void> {
    // Fetch contribution details, including joinContributions and related user information
    const contribution = await this.databaseService
      .getPrismaClient()
      .contribution.findUnique({
        where: { id: contributionId },
        include: {
          joinContributions: {
            include: { User: { include: { PointWallet: true } } },
          },
        },
      });

    if (!contribution) {
      throw new Error('Contribution not found');
    }

    const totalServer = contribution.totalServer;
    const totalUser = contribution.totalUser;

    // Separate users into servers and users based on banicoop points or alphabetically if no points
    const sortedUsers = contribution.joinContributions
      .sort(
        (a, b) =>
          Number(a.User.PointWallet.banicoopPoints) -
            Number(b.User.PointWallet.banicoopPoints) ||
          a.User.firstName.localeCompare(b.User.firstName),
      )
      .map((joinContribution, index) => ({
        ...joinContribution,
        participantNumber: index + 1, // 1-indexed position
        participantType: index < totalServer ? 'SERVER' : 'USER',
      }));

    // Determine participant numbers for server and user participants
    const serverParticipants = sortedUsers.slice(0, totalServer);
    const userParticipants = sortedUsers.slice(totalServer);

    // Update the participantNumber and participantType for each participant based on their group
    const updatedJoinContributions = serverParticipants
      .concat(userParticipants)
      .map((participant) => ({
        id: participant.id,
        participantNumber: participant.participantNumber,
        participantType: participant.participantType,
      }));

    // Update participant numbers and types in the database
    await this.databaseService.getPrismaClient().joinContribution.updateMany({
      where: {
        OR: updatedJoinContributions.map((participant) => ({
          id: participant.id,
        })),
      },
      data: updatedJoinContributions,
    });
  }

  async joinContribution(
    joinContributionDto: JoinContributionDto,
    userId: number,
  ): Promise<void> {
    const { contributionId, useDetails, dayOfRemittance, displayName } =
      joinContributionDto;
    // Fetch contribution details
    const contribution = await this.databaseService
      .getPrismaClient()
      .contribution.findUnique({
        where: { id: contributionId },
      });

    const startDatetime = contribution.startDate;
    const endDatetime = contribution.endDate;
    const months = this.generateMonths(startDatetime, endDatetime);

    const contributionUserMonths = months.map((month) => ({
      month: month.month,
      paid: false,
      monthOfCollection: false,
    }));

    if (!contribution) {
      throw new Error('Contribution not found');
    }

    // Check if user has already joined the contribution
    const existingJoinContribution = await this.databaseService
      .getPrismaClient()
      .joinContribution.findFirst({
        where: {
          contributionId: contributionId,
          userId: userId,
        },
      });

    if (existingJoinContribution) {
      throw new Error('User has already joined the contribution');
    }

    // Check if there is space for the user in the contribution
    const totalParticipants = contribution.totalServer + contribution.totalUser;
    const currentParticipants = await this.databaseService
      .getPrismaClient()
      .joinContribution.count({
        where: { contributionId: contributionId },
      });

    if (currentParticipants >= totalParticipants) {
      throw new Error('Contribution is already full');
    }

    // Create the joinContribution record for the user without participantNumber

    // Determine participantType based on whether the user is a server or user
    const participantType =
      currentParticipants < contribution.totalServer ? 'SERVER' : 'USER';

    const createdJoinContribution = await this.databaseService
      .getPrismaClient()
      .joinContribution.create({
        data: {
          User: {
            connect: {
              id: userId,
            },
          },
          Contribution: {
            connect: {
              id: contributionId,
            },
          },
          participantType: participantType,
          useDetails,
          displayName,
          dayOfRemittance,
          contributionUserMonth: {
            create: contributionUserMonths,
          },
          isServer: false,
        },
      });

    if (!createdJoinContribution) {
      throw new Error('Failed to join the contribution');
    }
  }

  async getUserJoinContributionDetails(contributionId: number, userId: number) {
    try {
      const userJoinContribution = await this.databaseService
        .getPrismaClient()
        .joinContribution.findFirst({
          where: { contributionId, userId },
          include: { contributionUserMonth: true, Contribution: true },
        });
      return userJoinContribution;
    } catch (error) {
      throw error;
    }
  }

  async getUserJoinContributionTransaction(
    joinContributionId: number,
    userId: number,
  ): Promise<Transaction[]> {
    try {
      return await this.databaseService.getPrismaClient().transaction.findMany({
        where: { joinContributionId, userId },
      });
    } catch (error) {
      throw error;
    }
  }

  //   generateMonths(start: Date, end: Date): { month: string }[] {
  //     const months = [];
  //     let currentDate = new Date(start);

  //     const monthNames = [
  //       'January',
  //       'February',
  //       'March',
  //       'April',
  //       'May',
  //       'June',
  //       'July',
  //       'August',
  //       'September',
  //       'October',
  //       'November',
  //       'December',
  //     ];

  //     while (currentDate <= end) {
  //       const monthName = monthNames[currentDate.getMonth()];
  //       months.push({ month: monthName });
  //       currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
  //     }

  //     return months;
  //   }

  generateMonths(start: Date, end: Date): { month: string }[] {
    const months = [];
    let currentDate = new Date(start);

    while (currentDate <= end) {
      const monthName = currentDate.toLocaleDateString('en-US', {
        month: 'long',
      });
      months.push({ month: monthName });
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return months;
  }
  calculateMonthlyOutput(participants: number, monthlyAmount: number): number {
    // You can apply your own logic for calculating the monthly output here
    // For example, you might simply multiply the number of participants by the monthly amount
    return participants * monthlyAmount;
  }

  // Function to mark a user's payment for a specific month
  async markPayment(
    makePaymentContributionDto: MakePaymentContributionDto,
  ): Promise<MakePaymentResDto> {
    const { joinContributionId, monthIdentifier, userId } =
      makePaymentContributionDto;
    // Check if the user has already paid for the specified month

    const joinContribution = await this.databaseService
      .getPrismaClient()
      .joinContribution.findFirst({
        where: { id: joinContributionId },
        include: { Contribution: true },
      });
    let contributionUserMonth: ContributionUserMonth;

    // Check if the user provided a numeric month ID
    if (typeof monthIdentifier === 'number') {
      contributionUserMonth = await this.databaseService
        .getPrismaClient()
        .contributionUserMonth.findUnique({
          where: { id: monthIdentifier },
        });
    } else {
      // Assume the user provided the month name
      contributionUserMonth = await this.databaseService
        .getPrismaClient()
        .contributionUserMonth.findFirst({
          where: {
            joinContributionId,
            month: monthIdentifier as string,
          },
        });
    }
    if (!contributionUserMonth || contributionUserMonth.paid) {
      throw new Error(
        `Payment for ${contributionUserMonth.month} has already been made`,
      );
    }

    // Update the ContributionUserMonth to mark the payment as true
    const usermont = await this.databaseService
      .getPrismaClient()
      .contributionUserMonth.update({
        where: {
          id: contributionUserMonth.id,
        },
        data: {
          paid: true,
        },
      });

    const transactionRef = uuid.v4();
    // Create a transaction for the payment
    const transaction = await this.databaseService
      .getPrismaClient()
      .transaction.create({
        data: {
          amount: joinContribution.Contribution.monthlyAmount,
          description: `Payment for ${contributionUserMonth.month}`,
          walletType: WalletType.contributionWallet,
          transactionType: TransactionType.WITHDRAWAL,
          transactionStatus: TransactionStatus.SUCCESSFUL,
          transactionRef: transactionRef,
          User: {
            connect: { id: userId },
          },
          JoinContribution: {
            connect: { id: joinContribution.id },
          },
        },
      });

    return {
      transaction,
      monthDetails: usermont,
    };
  }
}
