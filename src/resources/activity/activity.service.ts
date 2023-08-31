import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ActivityEnumType,
  ActivityPayload,
  CreateActivityDto,
  VerifyActivityDto,
  activityUsageMap,
} from 'src/dto/activity/activity.dto';
import { User } from '../auth/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Activities } from './activity.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  ActivityUsageData,
  ActivityUsageEnum,
  VerifyActivityUsage,
} from 'src/dto/auth/user.dto';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activities)
    private activityRepository: Repository<Activities>,
  ) {}

  async intiateActivity(
    createActivityDto: CreateActivityDto,
    user: User,
  ): Promise<ActivityPayload> {
    const { activityType } = createActivityDto;

    console.log(activityType);
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    const usage = this.getActivitiesUsage(activityType);
    const activityHash = await this.generateRandomHash();
    const newinfo = await this.activityRepository.save({
      userId: user.id,
      expiresAt,
      expectedUsage: usage,
      activityHash,
      activityType,
    });

    const newActivity: ActivityPayload = {
      activityHash: newinfo.activityHash,
      activityType: activityType,
    };
    return newActivity;
    // return this.activityRepository.create();
  }

  async verifyActivityHash(
    verifyActivityDto: VerifyActivityDto,
  ): Promise<boolean> {
    const { activityHash, activityType, userId } = verifyActivityDto;
    const record = await this.getSingleActivity(activityHash, userId);

    //check if record exists
    if (record) {
      // verify if the records activity type matches the request activity type
      if (
        record.activityType == activityType ||
        record.activityType == ActivityEnumType.SIGNIN ||
        record.activityType == ActivityEnumType.SIGNUP
      ) {
        const now = new Date();

        // verify if the records activity hash is still valid and has not expired
        if (record.expiresAt < now) {
          throw new BadRequestException(
            'Invalid Activity Hash or Expired Activity Hash.',
          );
        }

        // if (record.expectedUsage == ActivityUsageEnum.TWO_AUTHENTICATION + 1) {
        //   if (record.usage !== ActivityUsageEnum.TWO_AUTHENTICATION) {
        //   }
        // }

        // check if the activity has been used
        // if (record.expectedUsage == record.usage) {
        //   throw new BadRequestException(
        //     'Activity Hash has been used or expired.',
        //   );
        // }
      } else {
        throw new BadRequestException('Invalid activty hash for this activity');
      }
      return true;
    }
  }

  async getSingleActivity(hash: string, userId: string): Promise<Activities> {
    // return;
    const record = await this.activityRepository.findOne({
      where: { activityHash: hash, userId: userId },
    });

    if (!record) {
      // throw UnauthorizedException(
      //   'Invalid OTP or Expired otp. Please check your inbox and try again.',
      // );
      throw new BadRequestException('Invalid Activity Hash or Expired Hash.');
    }
    return record;
  }

  getActivitiesUsage(activityType: ActivityEnumType) {
    return activityUsageMap[activityType];

    // if (activityType == ActivityEnumType.CHANGE_EMAIL) {
    //   return 2;
    // } else if (activityType == ActivityEnumType.CHANGE_PASSWORD) {
    //   return 2;
    // } else if (activityType == ActivityEnumType.CHANGE_PHONE) {
    //   return 2;
    // } else if (activityType == ActivityEnumType.DELETE_USER) {
    //   return 1;
    // } else if (activityType == ActivityEnumType.FORGOT_PASSWORD) {
    //   return 2;
    // } else if (activityType == ActivityEnumType.SEND_OTP) {
    //   return 1;
    // } else if (activityType == ActivityEnumType.SETTINGS_UPDATE) {
    //   return 1;
    // } else if (activityType == ActivityEnumType.SIGNIN) {
    //   return 1;
    // } else if (activityType == ActivityEnumType.SIGNUP) {
    //   return 1;
    // } else if (activityType == ActivityEnumType.UPDATE_PIN) {
    //   return 2;
    // } else {
    //   return;
    // }
  }

  async updateActivityStatus(
    verifyActivityDto: VerifyActivityDto,
  ): Promise<boolean> {
    const record = await this.getSingleActivity(
      verifyActivityDto.activityHash,
      verifyActivityDto.userId,
    );

    if (record) {
      if (record.expectedUsage == ActivityUsageEnum.ONE_AUTHENTICATION) {
        record.usage = ActivityUsageEnum.ONE_AUTHENTICATION;
        await this.activityRepository.save(record);
        return true;
      } else if (
        record.expectedUsage ==
        ActivityUsageEnum.TWO_AUTHENTICATION + 1
      ) {
        record.usage = record.usage + 1;
        await this.activityRepository.save(record);
        return true;
      }
    }
  }

  async generateRandomHash(): Promise<string> {
    const randomValue = Math.random().toString();
    const saltRounds = 10;
    return bcrypt.hash(randomValue, saltRounds);
  }

  async verifyActivityUsage(verifyActivityUsage: VerifyActivityUsage) {
    const { activityHash, userId, activityUsage } = verifyActivityUsage;
    console.log(activityUsage);
    const record = await this.getSingleActivity(activityHash, userId);

    if (activityUsage == ActivityUsageEnum.ONE_AUTHENTICATION) {
      return;
    } else if (activityUsage == ActivityUsageEnum.TWO_AUTHENTICATION + 1) {
      if (record.usage >= 2) {
        return;
      } else {
        if (record.usage !== ActivityUsageEnum.TWO_AUTHENTICATION) {
          throw new BadRequestException(
            `Activity hash must have been used at least once before performing this action`,
          );
        }
      }
    }
  }
}
