import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { UserService } from '../user/user.service';
import { DatabaseService } from 'src/services/database/database.service';
import {
  ActivityEnumType,
  ActivityPayload,
  CreateActivityDto,
  VerifyActivityDto,
  activityUsageMap,
} from 'src/dto/activity/activity.dto';
import { ActivityUsageEnum, VerifyActivityUsage } from 'src/dto/auth/user.dto';

@Injectable()
export class ActivityService {
  // constructor() {}

  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,

    private databaseService: DatabaseService,
  ) {}

  async initiateActivity(
    createActivityDto: CreateActivityDto,
    userId: number,
  ): Promise<ActivityPayload> {
    const user = await this.userService.findOne(userId);
    const { activityType } = createActivityDto;
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    const usage = this.getActivitiesUsage(activityType);
    const activityHash = await this.generateRandomHash();
    const newActivity = await this.databaseService.activity.create({
      data: {
        User: { connect: { id: user.id } },
        expiresAt,
        expectedUsage: usage,
        activityHash,
        activityType,
        usage: 2,
      },
    });
    return {
      activityHash: newActivity.activityHash,
      activityType: activityType,
    };
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
      } else {
        throw new BadRequestException('Invalid activty hash for this activity');
      }
      return true;
    }
  }

  async getSingleActivity(hash: string, userId: number) {
    const record = await this.databaseService.activity.findFirst({
      where: {
        activityHash: hash,
        userId: userId,
      },
    });

    if (!record) {
      throw new BadRequestException('Invalid Activity Hash or Expired Hash.');
    }

    return record;
  }

  getActivitiesUsage(activityType: ActivityEnumType) {
    return activityUsageMap[activityType];
  }

  async updateActivityStatus(
    verifyActivityDto: VerifyActivityDto,
  ): Promise<boolean> {
    const record = await this.getSingleActivity(
      verifyActivityDto.activityHash,
      verifyActivityDto.userId,
    );

    if (record) {
      if (record.expectedUsage === ActivityUsageEnum.ONE_AUTHENTICATION) {
        await this.databaseService.activity.update({
          where: {
            id: record.id,
          },
          data: {
            usage: ActivityUsageEnum.ONE_AUTHENTICATION,
          },
        });
        return true;
      } else if (
        record.expectedUsage ===
        ActivityUsageEnum.TWO_AUTHENTICATION + 1
      ) {
        await this.databaseService.activity.update({
          where: {
            id: record.id,
          },
          data: {
            usage: {
              increment: 1,
            },
          },
        });
        return true;
      }
    }
    return false;
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

  async initiateUserActivity(
    activityType: ActivityEnumType,
    userId: number,
  ): Promise<string> {
    try {
      const info = {
        activityType,
      };
      const resp = await this.initiateActivity(info, userId);

      return resp.activityHash;
    } catch (error) {
      throw error;
    }
  }

  async verifyUserActivity(
    activityHash: string,
    user: any,
    activityUsage: number,
  ): Promise<any> {
    const singleActivity = await this.getSingleActivity(activityHash, user.id);
    const verifyHashInfo = {
      userId: user.id,
      activityType: singleActivity.activityType as ActivityEnumType,
      activityHash,
    };
    await this.verifyActivityHash(verifyHashInfo);
    await this.verifyActivityUsage({
      activityHash,
      userId: user.id,
      activityUsage: activityUsage,
    });
    return singleActivity;
  }
}
