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
import { CodeStatus } from 'src/dto/otp';
@Injectable()
export class VisitorService {
  private logger = new Logger('TaskService', { timestamp: true });
  constructor(
    @InjectRepository(Visitor)
    private visitorRepository: Repository<Visitor>,
    private generateRandom: GenerateRandom,
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
      fullName,
      phoneNumber,
      userId: user.id,
      host: user,
      purposeOfVisit,
    });

    await this.visitorRepository.save(newtoken);
    return newtoken;
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
          CodeStatus.CHECKED_IN,
        );
      } else if (verifyAction.action == VisitorActionTypes.CHECK_OUT) {
      }
    } catch (error) {
      throw error;
    }
  }

  async getSingleExternalCode(code: string) {
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

  async updateVisitStatus(code: string, status: CodeStatus) {
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
        status == CodeStatus.CHECKED_IN
      ) {
        record.status = status;
        record.usage = record.usage + 1;
        await this.visitorRepository.save(record);
        const info: VerifyVisitPayload = await this.getSingleExternalCode(code);

        return info;
      }
    } catch (error) {
      throw error;
    }
  }
}
