import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import {
  CreateTokenDto,
  VerifyActionParam,
  VerifyVisitDto,
  VerifyVisitPayload,
  VisitorActionTypes,
} from 'src/dto/token';
import { Visitor } from './visitor.entity';
import { GenerateRandom } from 'src/helpers/generate-random';
import { User } from 'src/resources/auth/user.entity';
import {
  ActionTypeParams,
  CodeStatus,
  CreateGuest,
  InviteStatus,
} from 'src/dto/otp';
import { Guest } from '../guest/guest.entity';
import * as moment from 'moment';
@Injectable()
export class VisitorService {
  private logger = new Logger('TaskService', { timestamp: true });
  constructor(
    @InjectRepository(Visitor)
    private visitorRepository: Repository<Visitor>,
    private generateRandom: GenerateRandom,

    @InjectRepository(Guest)
    private guestRepository: Repository<Guest>,
  ) {}

  async getSingleVisit(code: any): Promise<Visitor> {
    console.log(code);
    const find = await this.visitorRepository
      .createQueryBuilder('visitor')
      .leftJoinAndSelect('visitor.host', 'host')
      .leftJoinAndSelect('visitor.guest', 'guest')
      .leftJoinAndSelect('host.company', 'company')
      .where('visitor.code = :code', { code: code.code })
      .select([
        'visitor.id',
        'visitor.code',
        'visitor.expiresAt',
        'visitor.validFrom',
        'visitor.createdAt',
        'visitor.updatedAt',
        'visitor.codeStatus',
        'visitor.userId',
        'visitor.inviteStatus',
        'guest.id',
        'guest.fullName',
        'guest.phoneNumber',
        'host.id',
        'host.firstName',
        'host.lastName',
        'host.username',
        'host.email',
      ])
      .getOne();

    if (!find) {
      this.logger.error(
        `User trying to use endpoint to get single code enpoint with a invalid token id: ${code}}`,
      );
      throw new BadRequestException(`Invalid Code`);
    }

    return find;
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

    if (validFrom >= expiresAt) {
      throw new BadRequestException('validFrom must be earlier than expiresAt');
    }

    const code = this.generateRandom.generateRandomToken(6);
    let find = await this.visitorRepository.findOne({
      where: { code: code },
    });
    if (find) {
      const random = this.generateRandom.generateRandomToken(6);
      find = await this.visitorRepository.findOne({
        where: { code: random },
      });
    }

    const newGuest = await this.createGuest({ fullName, phoneNumber });

    const newtoken: Visitor = this.visitorRepository.create({
      expiresAt,
      validFrom,
      oneTime,
      code,
      userId: user.id,
      host: user,
      purposeOfVisit,
      guest: newGuest,
      companyId: user.companyId,
      company: user.company,
    });

    await this.visitorRepository.save(newtoken);
    newGuest.visitorId = newtoken.id;
    await this.guestRepository.save(newGuest);
    return newtoken;
  }

  async getUserVisitor(user: User): Promise<Visitor[]> {
    return await this.visitorRepository
      .createQueryBuilder('visitor')
      .where({ userId: user.id })
      .leftJoinAndSelect('visitor.host', 'host')
      .leftJoinAndSelect('visitor.guest', 'guest') // Add this line to include guest relation
      .select([
        'visitor.id',
        'visitor.code',
        'visitor.expiresAt',
        'visitor.validFrom',
        'visitor.createdAt',
        'visitor.updatedAt',
        'visitor.codeStatus',
        'visitor.userId',
        'visitor.inviteStatus',
        'guest.id',
        'guest.fullName',
        'guest.phoneNumber',
        'host.id',
        'host.firstName',
        'host.lastName',
        'host.username',
        'host.email',
      ])
      .orderBy('visitor.updatedAt', 'DESC')
      .getMany();
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
        status: singleCode.inviteStatus,
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

      console.log(now, 'here is now');

      console.log(moment().format());

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

        if (
          record.inviteStatus == InviteStatus.INACTIVE &&
          actionType == VisitorActionTypes.CHECK_IN
        ) {
          record.inviteStatus = InviteStatus.CHECKED_IN;
          record.usage = record.usage + 1;

          if (record.oneTime) {
            record.codeStatus = CodeStatus.COMPLETED;
          }
          await this.visitorRepository.save(record);
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
          record.inviteStatus = InviteStatus.CHECKED_OUT;
          record.usage = record.usage + 1;
          if (record.oneTime) {
            record.codeStatus = CodeStatus.COMPLETED;
          }

          await this.visitorRepository.save(record);
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
        console.log(record);
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
        record.codeStatus = CodeStatus.EXPIRED;
        await this.visitorRepository.save(record);
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

      record.codeStatus = CodeStatus.CANCELLED;
      // record.status = CodeStatus.CANCELLED;
      return await this.visitorRepository.save(record);
    } catch (error) {
      throw error;
    }
  }

  async createGuest(createGuest: CreateGuest) {
    const { fullName, phoneNumber } = createGuest;
    const newguest: Guest = this.guestRepository.create({
      fullName,
      phoneNumber,
    });

    await this.guestRepository.save(newguest);
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
}
