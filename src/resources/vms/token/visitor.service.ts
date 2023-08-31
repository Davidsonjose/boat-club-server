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
import { ActionTypeParams, CodeStatus, CreateGuest } from 'src/dto/otp';
import { Guest } from '../guest/guest.entity';
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

  async getSingleVisit(code: string): Promise<Visitor> {
    const find = await this.visitorRepository.findOne({
      where: { code: code },
    });

    if (!find) {
      this.logger.error(
        `User trying to use endpoint to get single code enpoint with a invalid token id: ${code}}`,
      );
      throw new NotFoundException(`Invalid Code`);
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

    const newtoken: Visitor = this.visitorRepository.create({
      expiresAt,
      validFrom,
      oneTime,
      code,
      userId: user.id,
      host: user,
      purposeOfVisit,
    });

    await this.visitorRepository.save(newtoken);
    return newtoken;
  }

  async getUserVisitor(user: User): Promise<Visitor[]> {
    // return await this.visitorRepository.find({
    //   where: { userId: user.id },
    //   relations: ['host'],
    //   select: ['id', 'f']
    // });

    return await this.visitorRepository
      .createQueryBuilder('visitor')
      .leftJoinAndSelect('visitor.host', 'host', 'host.id = :userId', {
        userId: user.id,
      })
      .select([
        'visitor.id',
        'visitor.code',
        'visitor.expiresAt',
        'visitor.validFrom',
        'visitor.cancelled',
        'visitor.status',
        'host.id',
        'host.name', // Include only the id and name columns from the associated User (host)
      ])
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
      }
    } catch (error) {
      throw error;
    }
  }

  async getSingleExternalCode(code: string): Promise<VerifyVisitPayload> {
    try {
      const singleCode = await this.getSingleVisit(code);

      const info: VerifyVisitPayload = {
        status: singleCode.status,
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
      if (record.completed) {
        throw new BadRequestException(
          `Unable to update visit status for a completed visit`,
        );
      }

      if (record.cancelled) {
        throw new BadRequestException(
          `Unable to update visit status for a cancelled visit`,
        );
      }

      if (
        record.status == CodeStatus.INACTIVE &&
        actionType == VisitorActionTypes.CHECK_IN
      ) {
        record.status = CodeStatus.CHECKED_IN;
        record.usage = record.usage + 1;

        if (record.oneTime) {
          record.completed = true;
        }
        await this.visitorRepository.save(record);
        const info: VerifyVisitPayload = await this.getSingleExternalCode(code);

        return info;
      } else if (
        record.status == CodeStatus.CHECKED_IN &&
        actionType == VisitorActionTypes.CHECK_OUT
      ) {
        record.status = CodeStatus.CHECKED_OUT;
        record.usage = record.usage + 1;
        if (record.oneTime) {
          record.completed = true;
        }

        await this.visitorRepository.save(record);
        const info: VerifyVisitPayload = await this.getSingleExternalCode(code);

        return info;
      } else {
        throw new BadRequestException(`Invalid actionType`);
      }
    } catch (error) {
      throw error;
    }
  }

  async cancelVisit(code: string) {
    try {
      const record = await this.getSingleVisit(code);
      if (record.completed) {
        throw new BadRequestException(
          `Unable to cancel visit for a completed visit`,
        );
      }

      if (record.cancelled) {
        throw new BadRequestException(
          `Unable to cancel visit  for a cancelled visit`,
        );
      }

      record.cancelled = true;
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
}
