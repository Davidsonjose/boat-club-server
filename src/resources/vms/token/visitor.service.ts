import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Between, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import {
  CreateTokenDto,
  CreateVisitEventDto,
  VerifyActionParam,
  VerifyVisitDto,
  VerifyVisitPayload,
  VisitorActionTypes,
} from 'src/dto/token';
import { GenerateRandom } from 'src/helpers/generate-random';
import * as QRCode from 'qrcode';
import { ActionTypeParams, CodeStatus, CreateGuest } from 'src/dto/otp';
import moment from 'moment';
import { UserService } from 'src/resources/user/user.service';
import { GetUserDto, RequestTypeEnum } from 'src/dto/auth/user.dto';
import { RabbitMQService } from 'src/services/rabbitMQ/rabbitmq.service';
import {
  AMQPEventType,
  AdminTypeEmum,
  EventPatternEnum,
} from 'src/services/rabbitMQ/interface';

import { OtpService } from 'src/resources/otp/otp.service';
import { CompanyEnum } from 'src/helpers/mailService';
import { CompanyId } from 'src/helpers/nodemailer.service';
import { Guest, InviteStatus, User, Visitor, VmsEvent } from '@prisma/client';
import { DatabaseService } from 'src/services/database/database.service';

@Injectable()
export class VisitorService {
  private logger = new Logger('TaskService', { timestamp: true });
  constructor(
    private generateRandom: GenerateRandom,

    private userService: UserService,

    // private otpService: OtpService,

    private rabbitMQService: RabbitMQService,

    private databaseService: DatabaseService,
  ) {}

  async getQrCode(code: string) {
    try {
      const inviteCode = `${code}#`;
      const qrCodeDataURL = await QRCode.toDataURL(inviteCode, {
        width: 200, // This controls both width and height proportionally
      });

      console.log('qrcode data URL: ' + qrCodeDataURL);
      return qrCodeDataURL;
    } catch (error) {
      throw error;
    }
  }

  async getSingleVisit(code: any): Promise<any> {
    const find = await this.databaseService
      .getPrismaClient()
      .visitor.findFirst({
        where: { code },
        include: { guest: true, host: true },
      });

    if (!find) {
      this.logger.error(
        `User trying to use endpoint to get single code enpoint with a invalid token id: ${code}}`,
      );
      throw new BadRequestException(`Invalid Code`);
    }

    return find;
  }

  async downtime() {
    try {
      throw new BadRequestException(
        `Oppppss an error occurred, pleaase try again after some time.`,
      );
    } catch (error) {}
  }

  async createVisit(
    createTokenDto: CreateTokenDto,
    user: User,
  ): Promise<Visitor> {
    const {
      validFrom,
      expiresAt,
      oneTime,
      phoneNumber,
      fullName,
      purposeOfVisit,
    } = createTokenDto;

    // throw new BadRequestException(
    //   `Oppppss an error occurred, pleaase try again after some time.`,
    // );

    const today = new Date();
    let status: InviteStatus = createTokenDto.now
      ? InviteStatus.ACTIVE
      : InviteStatus.INACTIVE;

    const mainuser = await this.databaseService
      .getPrismaClient()
      .user.findFirst({
        where: { id: user.id },
        include: { Settings: true },
      });

    const visitExitTime = 7;
    const newTime = new Date(today.getTime() + visitExitTime * 60 * 60 * 1000);

    await this.verifyUserInviteEligibility(user);

    if (validFrom <= today) {
      status = InviteStatus.ACTIVE;
    }

    if (validFrom >= expiresAt) {
      throw new BadRequestException('validFrom must be earlier than expiresAt');
    }

    let code = this.generateRandom.generateRandomToken(7);
    while (
      await this.databaseService
        .getPrismaClient()
        .visitor.findFirst({ where: { code } })
    ) {
      code = this.generateRandom.generateRandomToken(7);
    }

    const newGuest = await this.createGuest({ fullName, phoneNumber });

    const newtoken = (await this.databaseService
      .getPrismaClient()
      .visitor.create({
        data: {
          expiresAt: createTokenDto.now ? newTime : expiresAt,
          validFrom,
          oneTime: oneTime ?? false, // Explicit default to avoid undefined errors
          code,
          purposeOfVisit: purposeOfVisit ?? '', // Ensure it has a default value
          inviteStatus: status ?? InviteStatus.INACTIVE,
          guest: { connect: { id: newGuest.id } },
          host: { connect: { id: user.id } },
        },
      })) as Visitor;

    if (mainuser.deactivated) {
      throw new BadRequestException(
        `You are unauthorized to perform this action. Contact support.`,
      );
    }

    const userSettings = await this.databaseService
      .getPrismaClient()
      .settings.findFirst({
        where: { id: mainuser.Settings.id },
      });

    if (Number(userSettings.todayInvite) >= Number(userSettings.inviteLimit)) {
      throw new BadRequestException('Invite limit reached for today.');
    }
    await this.databaseService.getPrismaClient().settings.update({
      where: { id: userSettings.id },
      data: {
        todayInvite: {
          increment: 1,
        },
      },
    });

    // await this.visitorRepository.save(newtoken);
    // newGuest.visitorId = newtoken.id;
    // await this.guestRepository.save(newGuest);

    return newtoken;
  }

  async updateInviteLimit(companyId: any): Promise<void> {
    try {
      // await this.settingsRepository
      //   .createQueryBuilder()
      //   .update(Settings)
      //   .set({ inviteLimit: 10?.toString() })
      //   .where('companyId = :companyId', { companyId: 7 })
      //   .execute();
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }

  async createEventVisit(
    createTokenDto: CreateVisitEventDto,
    user: User,
  ): Promise<VmsEvent> {
    const { startFrom, endAt, description, address, eventType, expectedGuest } =
      createTokenDto;

    const today = new Date();

    await this.verifyUserInviteEligibility(user);

    if (startFrom >= endAt) {
      throw new BadRequestException(
        'Start date must be earlier than expiresAt',
      );
    }

    // const code = this.generateRandom.generateRandomToken(6);
    // let find = await this.vmsEventRepository.findOne({
    //   where: { code: code },
    // });

    const detaileduser = await this.userService.findOne(user.id);

    // if (detaileduser) {
    //   const random = this.generateRandom.generateRandomToken(6);
    //   find = await this.visitorRepository.findOne({
    //     where: { code: random },
    //   });
    // }

    const newEvent = await this.databaseService
      ?.getPrismaClient()
      .vmsEvent.create({
        data: {
          startFrom,
          endAt,
          eventType,
          expectedGuest,
          address,
          description,
          host: { connect: { id: user.id } },
        },
      });

    await this.handleNewEventMQ(newEvent, user);
    // await this.otpService.sendEventEmail(
    //   newEvent,
    //   detaileduser.company,
    //   detaileduser,
    // );
    return newEvent;
  }

  async handleNewEventMQ(event: VmsEvent, user: User) {
    try {
      const { firstName, lastName, id } = user;
      this.rabbitMQService.emit({
        ...RabbitMQService.generateEventPayloadMetaData({
          user: {
            firstName,
            lastName,
            userId: id,
          },
          event: {
            id: event.id,
            endAt: event.endAt,
            startFrom: event.startFrom,
            expectedGuest: event.expectedGuest,
            eventStatus: event.eventStatus,
            address: event.address,
            description: event.description,
            eventType: event.eventType,
          },
          ipAddress: '',
        }),
        eventSource: AdminTypeEmum.ADMIN,
        eventType: AMQPEventType.PUSH,
        eventPattern: EventPatternEnum.VISIT_EVENT,
      });
    } catch (error) {}
  }

  async handleEvent() {
    try {
      const user = {
        firstName: 'Joseph',
        lastName: 'Davidson',
        companyId: 7,
        id: 'ac31fa1a-56d7-4a78-b573-42c112ce8d59',
      };
      const { firstName, lastName, companyId, id } = user;
      this.rabbitMQService.emit({
        ...RabbitMQService.generateEventPayloadMetaData({
          user: {
            firstName,
            lastName,
            companyId,
            userId: id,
          },
          event: {
            id: 5,
            endAt: '2024-04-10T19:17:00.000Z',
            startFrom: '2024-04-10T12:22:00.000Z',
            expectedGuest: '11-20',
            eventStatus: 'PENDING',
            address: 'Osaro isokpan',
            description: 'For my family',
            eventType: 'Birthday Party',
          },
          ipAddress: '',
        }),
        eventSource: AdminTypeEmum.ADMIN,
        eventType: AMQPEventType.PUSH,
        eventPattern: EventPatternEnum.VISIT_EVENT,
      });
    } catch (error) {}
  }
  async getUserVisitor(
    user: User,
    take: number = 10,
    skip: number = 0,
    status?: string, // Optional status filter
  ): Promise<Visitor[]> {
    take = Math.max(1, Math.min(take, 100)); // Ensure valid take
    skip = Math.max(0, skip); // Ensure valid skip

    const query = await this.databaseService
      .getPrismaClient()
      .visitor.findMany({
        where: { userId: user.id },
        skip: skip,
        take: take,
        include: { guest: true },
      });

    // Determine if the status matches inviteStatus or codeStatus
    // if (status) {
    //   if (Object.values(InviteStatus).includes(status as InviteStatus)) {
    //     // If the status matches inviteStatus
    //     query.andWhere('visitor.inviteStatus = :status', { status });
    //   } else if (Object.values(CodeStatus).includes(status as CodeStatus)) {
    //     // If the status matches codeStatus
    //     query.andWhere('visitor.codeStatus = :status', { status });
    //   }
    // }

    return query;
  }

  async getUserVmsEvents(
    user: GetUserDto,
    take: number = 10, // Default to 10 items per page if not specified
    skip: number = 0, // Default to the first page if not specified
  ): Promise<VmsEvent[]> {
    try {
      // Ensure 'take' and 'skip' have sensible values
      take = Math.max(1, Math.min(take, 100)); // Limit max 'take' to 100
      skip = Math.max(0, skip); // Ensure 'skip' is non-negative

      const events = await this.databaseService
        .getPrismaClient()
        .vmsEvent.findMany({
          where: {
            userId: user.id,
          },
          include: { visitor: true },
          // orderBy: 'DESC',
          take: take, // Apply pagination
          skip: skip, // Apply offset
        });

      return events;
    } catch (error) {
      // Handle or log the error appropriately
      throw error;
    }
  }

  async getSingleVmsEvent(id: number): Promise<VmsEvent> {
    try {
      const event = await this.databaseService
        .getPrismaClient()
        .vmsEvent.findFirst({
          where: {
            id: id,
          },
          include: { visitor: true, host: true },
          // order: { createdAt: 'DESC' },
        });
      return event;
    } catch (error) {
      throw error;
    }
  }
  async verifyVisit(
    verifyVisitDto: VerifyVisitDto,
    verifyAction: VerifyActionParam,
  ) {
    try {
      if (verifyAction.action == VisitorActionTypes.VERIFY) {
        return await this.getSingleExternalCode(verifyVisitDto.code);
      } else if (verifyAction.action == VisitorActionTypes.CHECK_IN) {
        return await this.updateVisitStatus(
          verifyVisitDto.code,
          VisitorActionTypes.CHECK_IN,
        );
      } else if (verifyAction.action == VisitorActionTypes.CHECK_OUT) {
        return await this.updateVisitStatus(
          verifyVisitDto.code,
          VisitorActionTypes.CHECK_OUT,
        );
      }
    } catch (error) {
      throw error;
    }
  }

  async getSingleExternalCode(code: string): Promise<VerifyVisitPayload> {
    try {
      const singleCode = await this.getSingleVisit(code);

      const info: VerifyVisitPayload = {
        status: singleCode.inviteStatus as InviteStatus,
        code: code,
      };
      return info;
    } catch (error) {
      throw error;
    }
  }

  async updateVisitStatus(
    code: string,
    actionType: VisitorActionTypes,
  ): Promise<VerifyVisitPayload> {
    try {
      const record = await this.getSingleVisit(code);

      // const now = new Date();
      // const nowUTC = new Date();
      const now = moment().format();

      this.logger.log(`Current Time (UTC): ${now}`);
      const validFrom = record.validFrom?.toString();
      const expiresAt = record.expiresAt?.toString();

      const validFromFormatted = this.formatTime(validFrom);
      const expiresAtFormatted = this.formatTime(expiresAt?.toString());
      const nowFormatted = this.formatTime(now);

      if (record.codeStatus == CodeStatus.EXPIRED) {
        this.logger.error(
          `Guest ${
            record?.guest?.fullName
          } trying to gain access to ESTATE: ${record?.host?.company?.name?.toUpperCase()} with code: ${code} that expired at ${expiresAtFormatted}`,
        );
        throw new BadRequestException('Visit has expired');
      }
      if (now >= validFrom && now <= expiresAt) {
        if (record.codeStatus == CodeStatus.COMPLETED) {
          throw new BadRequestException(
            `Unable to update visit status for a completed visit`,
          );
        }

        if (record.codeStatus == CodeStatus.CANCELLED) {
          throw new BadRequestException(
            `Unable to update visit status for a cancelled visit`,
          );
        }

        // Validate usage type
        if (
          record.usageType === 'IN' &&
          actionType === VisitorActionTypes.CHECK_OUT
        ) {
          throw new BadRequestException(
            `Code can only be used for CHECK_IN action when usageType is IN`,
          );
        } else if (
          record.usageType === 'OUT' &&
          actionType === VisitorActionTypes.CHECK_IN
        ) {
          throw new BadRequestException(
            `Code can only be used for CHECK_OUT action when usageType is OUT`,
          );
        }

        // Rest of your existing logic...
        // Ensure to update record.usageType as needed based on actionType
        // Example:
        if (actionType === VisitorActionTypes.CHECK_IN) {
          record.usageType = 'IN';
        } else if (actionType === VisitorActionTypes.CHECK_OUT) {
          record.usageType = 'OUT';
        }

        if (
          record.inviteStatus == InviteStatus.INACTIVE &&
          actionType == VisitorActionTypes.CHECK_IN
        ) {
          // record.inviteStatus = InviteStatus.CHECKED_IN;
          // record.usage = record.usage + 1;

          // if (record.oneTime) {
          //   record.codeStatus = CodeStatus.COMPLETED;
          // }

          await this.databaseService.getPrismaClient().visitor.update({
            where: { id: record.id },
            data: {
              inviteStatus: InviteStatus.CHECKED_IN,
              usage: record.usage + 1,
              // usageType: newUsageType,
              ...(record.oneTime && { codeStatus: CodeStatus.COMPLETED }),
            },
          });
          // await this.visitorRepository.save(record);
          const info: VerifyVisitPayload = await this.getSingleExternalCode(
            code,
          );

          this.logger.verbose(
            `Guest ${record?.guest?.fullName}  gain access to estate ${record?.host?.company?.name} with code: ${code}} at ${nowFormatted}`,
          );

          return info;
        } else if (
          record.inviteStatus == InviteStatus.CHECKED_IN &&
          actionType == VisitorActionTypes.CHECK_OUT
        ) {
          // record.inviteStatus = InviteStatus.CHECKED_OUT;
          // record.usage = record.usage + 1;
          // if (record.oneTime) {
          //   record.codeStatus = CodeStatus.COMPLETED;
          // }

          await this.databaseService.getPrismaClient().visitor.update({
            where: { id: record.id },
            data: {
              inviteStatus: InviteStatus.CHECKED_OUT,
              usage: record.usage + 1,
              // usageType: newUsageType,
              ...(record.oneTime && { codeStatus: CodeStatus.COMPLETED }),
            },
          });
          // await this.visitorRepository.save(record);
          const info: VerifyVisitPayload = await this.getSingleExternalCode(
            code,
          );
          this.logger.verbose(
            `Guest ${record?.guest?.fullName}  gain access to estate ${record?.host?.company?.name} with code: ${code}} at ${nowFormatted}`,
          );

          return info;
        } else {
          throw new BadRequestException(`Invalid actionType`);
        }
      } else if (now < validFrom) {
        this.logger.error(
          `Guest ${
            record?.guest?.fullName
          } trying to gain access to ESTATE: ${record?.host?.company?.name?.toUpperCase()} with code: ${code} not valid until ${validFromFormatted}`,
        );
        // return { message: 'Visit is not yet valid' };
        throw new BadRequestException('Visit is not yet valid');
      } else {
        this.logger.error(
          `Guest ${
            record?.guest?.fullName
          } trying to gain access to ESTATE: ${record?.host?.company?.name?.toUpperCase()} with code: ${code} that expired at ${expiresAtFormatted}`,
        );
        // record.codeStatus = CodeStatus.EXPIRED;
        await this.databaseService.getPrismaClient().visitor.update({
          where: { id: record.id },
          data: { codeStatus: CodeStatus.EXPIRED },
        });

        throw new BadRequestException('Visit has expired');
      }
    } catch (error) {
      throw error;
    }
  }

  async cancelVisit(code: string) {
    try {
      const record = await this.getSingleVisit(code);
      if (record.codeStatus == CodeStatus.COMPLETED) {
        throw new BadRequestException(
          `Unable to cancel visit for a completed visit`,
        );
      }

      if (record.codeStatus == CodeStatus.CANCELLED) {
        throw new BadRequestException(
          `Unable to cancel visit  for a cancelled visit`,
        );
      }

      await this.databaseService.getPrismaClient().visitor.update({
        where: { id: record.id },
        data: {
          codeStatus: CodeStatus.CANCELLED,
          inviteStatus: InviteStatus.INACTIVE,
        },
      });

      record.codeStatus = CodeStatus.CANCELLED;
      record.inviteStatus = InviteStatus.INACTIVE;
      // record.status = CodeStatus.CANCELLED;
    } catch (error) {
      throw error;
    }
  }

  async createGuest(createGuest: CreateGuest) {
    const { fullName, phoneNumber } = createGuest;
    const newguest = this.databaseService.getPrismaClient().guest.create({
      data: { fullName, phoneNumber },
    });

    return newguest;
  }

  formatTime(dateString): string {
    const parsedDateTime = new Date(dateString);

    const formattedDateTime = parsedDateTime.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZone: 'UTC', // Specify the desired time zone, e.g., 'UTC', 'America/New_York', etc.
    });
    return formattedDateTime;
  }

  async verifyUserInviteEligibility(user: User): Promise<boolean> {
    const usersettings = await this.userService.getUserSettings(user.id);
    if (Number(usersettings.inviteLimit) > 0) {
      return true;
    } else {
      // return true;
      throw new BadRequestException('Invite limit exceeded for today');
    }
  }

  async calculateWeeklyCheckInGrowth(user: GetUserDto): Promise<{
    currentWeek: number;
    previousWeek: number;
    growthPercentage: number;
  }> {
    const currentWeekStart = moment().startOf('isoWeek').toDate();
    const previousWeekStart = moment()
      .subtract(1, 'week')
      .startOf('isoWeek')
      .toDate();
    const previousWeekEnd = moment()
      .subtract(1, 'week')
      .endOf('isoWeek')
      .toDate();

    // Using entryTime to count this week's check-ins
    const currentWeekCount = await this.databaseService
      .getPrismaClient()
      .visitor.count({
        where: {
          entryTime: { gt: currentWeekStart },
        },
      });

    // Using entryTime to count last week's check-ins
    const previousWeekCount = await this.databaseService
      .prismaDatabase()
      .visitor.count({
        where: {
          entryTime: { gte: previousWeekStart, lte: previousWeekEnd },
        },
      });

    // Calculate the growth percentage
    let growthPercentage = 0;
    if (previousWeekCount > 0) {
      growthPercentage =
        ((currentWeekCount - previousWeekCount) / previousWeekCount) * 100;
    } else if (currentWeekCount > 0) {
      growthPercentage = 100;
    }

    return {
      currentWeek: currentWeekCount,
      previousWeek: previousWeekCount,
      growthPercentage: parseFloat(growthPercentage.toFixed(2)),
    };
  }

  async getActiveVisit(user: User): Promise<number> {
    try {
      const count = await this.databaseService.getPrismaClient().visitor.count({
        where: {
          userId: user.id,
          inviteStatus: {
            in: [InviteStatus.ACTIVE, InviteStatus.CHECKED_IN],
          },
        },
      });
      return count;
    } catch (error) {
      throw error;
    }
  }

  async getTotalVisitorCount(user: User): Promise<number> {
    try {
      const count = await this.databaseService.getPrismaClient().visitor.count({
        where: {
          userId: user.id,
        },
      });
      return count;
    } catch (error) {
      throw error;
    }
  }
}
