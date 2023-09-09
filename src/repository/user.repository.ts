import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSettingDto } from 'src/dto/settings/settings.dto';
import { RefreshToken } from 'src/resources/auth/refreshToken.entity';
import { User } from 'src/resources/auth/user.entity';
import { Repository } from 'typeorm';
import { addDays } from 'date-fns';
import { Settings } from 'src/resources/settings/settings.entity';
import { ActivityEnumType } from 'src/dto/activity/activity.dto';
import { ActivityService } from 'src/resources/activity/activity.service';
import {
  ActivityUsageEnum,
  ForgotPasswordUpdateDto,
  ForgotPasswordVerificationDto,
  ForgotVerifyPayload,
  RequestTypeEnum,
  UpdateEmailDto,
  UpdatePasswordDto,
  UpdatePhoneDto,
  UpdatePinDto,
  UpdateProfileDto,
  VerifyPinDto,
} from 'src/dto/auth/user.dto';
import { Activities } from 'src/resources/activity/activity.entity';
import { OtpService } from 'src/resources/otp/otp.service';
import { NotificationRepository } from './notification.repository';
import { CreateNotificationPropsData } from 'src/dto/notification/notifications.dto';
import {
  NotificationCategories,
  NotificationRel,
} from 'src/dto/notification/notification-enum.dto';
import { systemResponses } from 'src/res/systemResponse';
@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private activityService: ActivityService,
    private otpService: OtpService,
    private notificationRepository: NotificationRepository,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getSingleUser(email: string, type?: string): Promise<User> {
    if (type == RequestTypeEnum.AUTH) {
      let singleuser = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.location', 'location')
        .leftJoinAndSelect('user.settings', 'settings')
        .leftJoinAndSelect('user.company', 'company')
        .where('user.id = :email', { email })
        .getOne();

      if (!singleuser) {
        throw new UnauthorizedException('Unauthorized access');
      }
      return singleuser;
    }

    let singleuser = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.location', 'location')
      .leftJoinAndSelect('user.settings', 'settings')
      .leftJoinAndSelect('user.company', 'company')
      .where('user.email = :email', { email })
      .getOne();

    if (!singleuser) {
      throw new UnauthorizedException('Unauthorized access');
    }
    return singleuser;
  }

  async verifyEmail(user: User) {
    const singleuser = await this.getSingleUser(user.email);
    singleuser.emailVerified = true;
    await this.userRepository.save(singleuser);
    return;
  }

  async verifyPhone(user: User) {
    const singleuser = await this.getSingleUser(user.email);
    singleuser.phoneNumberVerified = true;
    await this.userRepository.save(singleuser);
    return;
  }
  async getUserSettings(user: User): Promise<Settings> {
    const singleuser = await this.getSingleUser(user.email);

    return singleuser.settings;
  }
  async pushNotificationToken(deviceToken: string, user: User) {
    const singleuser = await this.getSingleUser(user.email);
    singleuser.pushNotificationToken = deviceToken;
    await this.userRepository.save(singleuser);
    return;
  }

  async verifyPassword(pwd: string, user: User): Promise<void> {
    const singleuser = await this.getSingleUser(user.email);
    const isPasswordValid = await singleuser.comparePassword(pwd);

    if (!isPasswordValid) {
      throw new UnauthorizedException(`Incorrect credentials`);
    }
    return;
  }

  async updatePin(updatePinDto: UpdatePinDto) {
    const { user, activityHash, pin } = updatePinDto;
    const verifyHashInfo = {
      userId: user.id,
      activityType: ActivityEnumType.UPDATE_PIN,
      activityHash,
    };

    await this.activityService.verifyActivityHash(verifyHashInfo);
    await this.activityService.verifyActivityUsage({
      activityHash,
      userId: user.id,
      activityUsage: ActivityUsageEnum.TWO_AUTHENTICATION,
    });

    user.pin = pin;
    user.hasPin = true;
    const newnotification = this.notificationProfileCreate(user);
    await this.notificationRepository.createNotification(newnotification);
    return await this.userRepository.save(user);
  }

  async verifyPin(verifyPinDto: VerifyPinDto, user: User): Promise<void> {
    try {
      const { activityHash, pin } = verifyPinDto;

      if (activityHash) {
        const singleActivity = await this.verifyUserActivity(
          activityHash,
          user,
          ActivityUsageEnum.TWO_AUTHENTICATION,
        );
        if (pin == user.pin) {
          await this.activityService.updateActivityStatus({
            activityHash,
            userId: user.id,
            activityType: singleActivity.activityType,
          });
          return;
        }
      } else {
        if (pin == user.pin) {
          return;
        }
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updatePassword(
    updatePasswordDto: UpdatePasswordDto,
    user: User,
  ): Promise<void> {
    const singleActivity = await this.verifyUserActivity(
      updatePasswordDto.activityHash,
      user,
      // ActivityUsageEnum.TWO_AUTHENTICATION,
      this.activityService.getActivitiesUsage(ActivityEnumType.CHANGE_PASSWORD),
    );

    await this.activityService.updateActivityStatus({
      activityHash: singleActivity.activityHash,
      userId: user.id,
      activityType: singleActivity.activityType,
    });
    // return;

    user.pwd = updatePasswordDto.pwd;
    await this.userRepository.save(user);

    const newnotification = this.notificationProfileCreate(user);
    await this.notificationRepository.createNotification(newnotification);
    return;
  }

  async forgotPasswordUpdate(
    forgotPasswordUpdateDto: ForgotPasswordUpdateDto,
  ): Promise<void> {
    const user = await this.getSingleUser(
      forgotPasswordUpdateDto.userId,
      RequestTypeEnum.AUTH,
    );
    const singleActivity = await this.verifyUserActivity(
      forgotPasswordUpdateDto.activityHash,
      user,
      // ActivityUsageEnum.TWO_AUTHENTICATION,
      this.activityService.getActivitiesUsage(ActivityEnumType.FORGOT_PASSWORD),
    );

    await this.activityService.updateActivityStatus({
      activityHash: singleActivity.activityHash,
      userId: user.id,
      activityType: singleActivity.activityType,
    });
    // return;

    user.pwd = forgotPasswordUpdateDto.pwd;
    await this.userRepository.save(user);
    const newnotification = this.notificationProfileCreate(user);
    await this.notificationRepository.createNotification(newnotification);
    return;
  }

  async updateProfile(updateProfileDto: UpdateProfileDto, user: User) {
    const isUsernameAvailable = await this.isUsernameAvailable(
      updateProfileDto.username,
    );

    if (!isUsernameAvailable) {
      throw new BadRequestException(
        `Username ${updateProfileDto.username} is already taken. Please choose a different username.`,
      );
    }
    for (const key of Object.keys(updateProfileDto)) {
      if (updateProfileDto[key]) {
        user[key] = updateProfileDto[key];
      }
    }

    const newnotification = this.notificationProfileCreate(user);
    await this.notificationRepository.createNotification(newnotification);
    return await this.userRepository.save(user);
  }

  async updatePhone(updatePhoneDto: UpdatePhoneDto, user: User): Promise<void> {
    const { activityHash } = updatePhoneDto;

    const isUsernameAvailable = await this.isUsernameAvailable(
      updatePhoneDto.phoneNumber,
    );

    if (!isUsernameAvailable) {
      throw new BadRequestException(
        `Phone number ${updatePhoneDto.phoneNumber} is already taken. Please choose a different username.`,
      );
    }
    const singleActivity = await this.verifyUserActivity(
      activityHash,
      user,
      this.activityService.getActivitiesUsage(ActivityEnumType.CHANGE_PHONE),
    );
    await this.activityService.updateActivityStatus({
      activityHash,
      userId: user.id,
      activityType: singleActivity.activityType,
    });

    user.phoneNumber = updatePhoneDto.phoneNumber;
    const newnotification = this.notificationProfileCreate(user);
    await this.notificationRepository.createNotification(newnotification);
    await this.userRepository.save(user);
    return;
    // }
  }
  async updateEmail(updateEmailDto: UpdateEmailDto, user: User): Promise<void> {
    const { activityHash } = updateEmailDto;

    const isEmailAvailable = await this.isEmailAvailable(updateEmailDto.email);

    if (!isEmailAvailable) {
      throw new BadRequestException(
        `Email ${updateEmailDto.email} is already taken. Please choose a different username.`,
      );
    }
    const singleActivity = await this.verifyUserActivity(
      activityHash,
      user,
      this.activityService.getActivitiesUsage(ActivityEnumType.CHANGE_EMAIL),
    );

    await this.activityService.updateActivityStatus({
      activityHash,
      userId: user.id,
      activityType: singleActivity.activityType,
    });

    user.email = updateEmailDto.email;
    await this.userRepository.save(user);
    const newnotification = this.notificationProfileCreate(user);
    await this.notificationRepository.createNotification(newnotification);
    return;
  }

  async forgotPasswordVerify(
    forgotPasswordVerificationDto: ForgotPasswordVerificationDto,
  ): Promise<ForgotVerifyPayload> {
    const { email } = forgotPasswordVerificationDto;

    const singleUser = await this.getSingleUser(email);

    if (singleUser) {
      //
      const activityHash = await this.generateAuthActivityHash(
        singleUser,
        ActivityEnumType.FORGOT_PASSWORD,
      );

      await this.otpService.sendOtpEmail(
        singleUser,
        ActivityEnumType.FORGOT_PASSWORD,
      );
      const forgotPayloadInfo: ForgotVerifyPayload = {
        message:
          'You get a verification code to reset your password if your email is valid',
        foundUser: true,
        activityHash,
        userId: singleUser.id,
      };
      // return;
      return forgotPayloadInfo;
    } else {
      const forgotPayloadInfo: ForgotVerifyPayload = {
        message:
          'You get a verification code to reset your password if your email is valid',
        foundUser: false,
        activityHash: null,
        userId: null,
      };
      return forgotPayloadInfo;
    }
  }

  async isUsernameAvailable(username: string): Promise<boolean> {
    const existingUser = await this.userRepository.findOne({
      where: { username },
    });
    return !existingUser;
  }
  async isEmailAvailable(email: string): Promise<boolean> {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    return !existingUser;
  }
  async isPhoneAvailable(email: string): Promise<boolean> {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    return !existingUser; // Returns true if username is not taken, false otherwise
  }

  async verifyUserActivity(
    activityHash: string,
    user: User,
    activityUsage: number,
  ): Promise<Activities> {
    const singleActivity = await this.activityService.getSingleActivity(
      activityHash,
      user.id,
    );
    const verifyHashInfo = {
      userId: user.id,
      activityType: singleActivity.activityType,
      activityHash,
    };
    await this.activityService.verifyActivityHash(verifyHashInfo);
    await this.activityService.verifyActivityUsage({
      activityHash,
      userId: user.id,
      activityUsage: activityUsage,
    });
    return singleActivity;
  }

  async generateAuthActivityHash(
    user: User,
    activityType: ActivityEnumType,
  ): Promise<string> {
    const activityDto = {
      userId: user.id,
      activityType,
    };
    const activityHash = await this.activityService.intiateActivity(
      activityDto,
      user,
    );

    return activityHash.activityHash;
  }

  notificationProfileCreate(user: User) {
    const newnotification: CreateNotificationPropsData = {
      category: NotificationCategories.PROFILE,
      message: systemResponses.EN.NOTIFICATION.UPDATED_PROFILE,
      type: NotificationRel.IN_APP,
      user: user,
    };

    return newnotification;
  }
}
