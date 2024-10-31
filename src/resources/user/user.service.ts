import { BadRequestException, Injectable } from '@nestjs/common';
import { ActivityEnumType } from 'src/dto/activity/activity.dto';
import {
  CreateUserDto,
  ForgotPasswordUpdateDto,
  ForgotPasswordVerificationDto,
  ForgotVerifyPayload,
  GetUserDto,
  UpdateEmailDto,
  UpdatePasswordDto,
  UpdatePhoneDto,
  UpdateUserDto,
} from 'src/dto/auth/user.dto';
import { systemResponses } from 'src/res/systemResponse';
import { DatabaseService } from 'src/services/database/database.service';
import { ActivityService } from '../activity/activity.service';
import { OtpService } from '../otp/otp.service';
import { JwtService } from '@nestjs/jwt';
import {
  generatePasswordHash,
  generateUserUID,
} from 'src/helpers/lib/characterGeneration';
import IpwhoisService from 'src/services/ipwhois/IpwhoisService';
import {
  generateJwtAccessToken,
  generateJwtRefreshToken,
} from '../auth/common/auth.common';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private databaseService: DatabaseService,
    private activityService: ActivityService,
    private otpService: OtpService,
    private jwtService: JwtService,
    private ipWhoisService: IpwhoisService,
  ) {}

  async create(createUserDto: CreateUserDto & { ipAddress: string }) {
    const existingUsers = await this.findAll({ email: createUserDto.email });
    if (existingUsers.length !== 0) {
      throw new Error(systemResponses.EN.USER_ALREADY_EXISTS);
    }

    //TODO: clean input

    const userUid = generateUserUID();

    const pwdHash = await generatePasswordHash(createUserDto.pwd);

    const locationDetail = await this.ipWhoisService.getIpInfo(
      createUserDto.ipAddress,
    );

    // return {};
    //error will be handled by controller
    const newUser = await this.databaseService.getPrismaClient().user.create({
      data: {
        active: true,
        deleted: false,
        email: createUserDto.email,
        firstName: createUserDto.firstName,
        pass: pwdHash,
        lastName: createUserDto.lastName,
        referralCode: createUserDto.referralCode,
        profileImageUrl: createUserDto.profileImageUrl,
        phoneNumber: createUserDto.phoneNumber,
        memberId: createUserDto.memberId,
        dateOfBirth: createUserDto.dateOfBirth,
        uid: userUid,
        Location: {
          create: {
            country: locationDetail.country,
            borders: locationDetail.borders,
            continent: locationDetail.continent,
            countryCode: locationDetail.country_code,
            dialCode: locationDetail.calling_code,
            ipAddress: locationDetail.ip,
            isEu: locationDetail.is_eu,
            timezone: locationDetail?.timezone?.id,
            latitude: String(locationDetail.latitude),
            longitude: String(locationDetail.longitude),
            utc: locationDetail.timezone.utc,
          },
        },
        Settings: {
          create: {
            twoFaEnabledEmail: false,
            twoFaEnabledPhone: false,
            defaultCurrencyCode: 'USD',
            defaultCurrencyName: 'dollars',
            defaultCurrencySymbol: '$',
            enableEmailNotification: true,
            enablePushNotification: true,
            languageCode: 'dollars',
          },
        },
      },
    });

    const jwtAccessToken = generateJwtAccessToken({
      ipAddress: createUserDto.ipAddress,
      jwtService: this.jwtService,
      details: {
        id: newUser.id,
        uid: newUser.uid,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        clientIp: createUserDto.ipAddress,
        active: newUser.active,
        updatedAt: newUser.updatedAt,
        createdAt: newUser.createdAt,
      },
    });

    const jwtRefreshToken = generateJwtRefreshToken({
      accessToken: jwtAccessToken,
      jwtService: this.jwtService,
    });

    //send user otp

    const singleUser = await this.findOne(newUser.id);
    await this.otpService.sendUserSmsOtpRegister(singleUser);
    const activityHash = await this.activityService.initiateUserActivity(
      ActivityEnumType.SIGNUP,
      newUser.id,
    );

    const {
      pin,
      pass,
      hash,
      deleted,
      active,

      ...others
    } = newUser;
    return {
      newUser: others,
      accessToken: jwtAccessToken,
      refreshToken: jwtRefreshToken,
      activityHash,
    };
  }

  async findUserWithEmail(email: string) {
    const user = await this.databaseService.getPrismaClient().user.findFirst({
      where: {
        email,
      },
    });

    //return users.map(user => cleanUserResponse(user)); //TODO: only clean on controller end
    return user;
  }
  async getUserSettings(id: number) {
    const userSettings = await this.databaseService
      .getPrismaClient()
      .settings.findFirst({
        where: { id },
      });

    //return users.map(user => cleanUserResponse(user)); //TODO: only clean on controller end
    return userSettings;
  }
  async emailVerified(email: string) {
    try {
      const userDetails = await this.findUserWithEmail(email);
      const updatedUser = await this.databaseService
        .getPrismaClient()
        .user.update({
          where: {
            id: userDetails.id,
          },
          data: {
            emailVerified: true,
          },
        });
      console.log('here is the email verified');
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
  async phoneVerified(email: string) {
    try {
      const userDetails = await this.findUserWithEmail(email);
      const updatedUser = await this.databaseService
        .getPrismaClient()
        .user.update({
          where: {
            id: userDetails.id,
          },
          data: {
            phoneNumberVerified: true,
          },
        });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async findAll(filterDto: any) {
    const users = await this.databaseService.getPrismaClient().user.findMany({
      where: {
        email: filterDto.email,
        id: filterDto.id,
      },
      skip: filterDto.skipResults,
      take: filterDto.takeResultAmount,
    });

    //return users.map(user => cleanUserResponse(user)); //TODO: only clean on controller end
    return users;
  }

  //update user profile
  async findOne(id: number) {
    const user = await this.databaseService.getPrismaClient().user.findFirst({
      where: {
        id,
      },
      include: { Location: true },
    });

    const {
      pin,
      pass,
      hash,
      deleted,
      active,

      ...others
    } = user;
    return others;
  }

  async updateUser(updateUserDto: UpdateUserDto, id: number) {
    const { ...updateProfileDto } = updateUserDto;

    // Find the user by their email
    const user = await this.findOne(id);

    if (!user) {
      throw new Error('User not found');
    }

    try {
      const updatedUser = await this.databaseService
        .getPrismaClient()
        .user.update({
          where: { id },
          data: updateProfileDto,
        });
      const { pass, pin, hash, deleted, ...others } = updatedUser;
      return others;
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(
    updatePasswordDto: UpdatePasswordDto,
    user: User,
  ): Promise<void> {
    const singleActivity = await this.activityService.verifyUserActivity(
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

    const hashedPassword = await generatePasswordHash(updatePasswordDto.pwd);

    try {
      await this.databaseService.getPrismaClient().user.update({
        where: {
          id: user.id,
        },
        data: {
          pass: hashedPassword,
        },
      });
      // UPDATE USER NOTIFICATION
      // const newNotification = this.notificationProfileCreate(user);
      // await prisma.notification.create({
      //   data: newNotification,
      // });

      return;
    } catch (error) {
      console.error('Error occurred while updating password:', error);
      throw error;
    }
  }

  async updateEmail(updateEmailDto: UpdateEmailDto, user: User): Promise<void> {
    const { activityHash } = updateEmailDto;

    const isEmailAvailable = await this.findUserWithEmail(updateEmailDto.email);

    if (isEmailAvailable) {
      throw new BadRequestException(
        `Email ${updateEmailDto.email} is already taken. Please choose a different email.`,
      );
    }

    const singleActivity = await this.activityService.verifyUserActivity(
      activityHash,
      user,
      this.activityService.getActivitiesUsage(ActivityEnumType.CHANGE_EMAIL),
    );

    await this.activityService.updateActivityStatus({
      activityHash,
      userId: user.id,
      activityType: singleActivity.activityType,
    });

    try {
      await this.databaseService.getPrismaClient().user.update({
        where: {
          id: user.id,
        },
        data: {
          email: updateEmailDto.email,
        },
      });

      // update user notification
      // const newNotification = this.notificationProfileCreate(user);
      // await prisma.notification.create({
      //   data: newNotification,
      // });

      return;
    } catch (error) {
      console.error('Error occurred during email update:', error);
      throw error;
    }
  }

  async updatePhone(updatePhoneDto: UpdatePhoneDto, user: User): Promise<void> {
    const { activityHash } = updatePhoneDto;

    const isPhoneNumberAvailable = await this.findUserWithPhone(
      updatePhoneDto.phoneNumber,
    );

    if (isPhoneNumberAvailable) {
      throw new BadRequestException(
        `Phone number ${updatePhoneDto.phoneNumber} is already taken. Please choose a different phone number.`,
      );
    }

    const singleActivity = await this.activityService.verifyUserActivity(
      activityHash,
      user,
      this.activityService.getActivitiesUsage(ActivityEnumType.CHANGE_PHONE),
    );

    await this.activityService.updateActivityStatus({
      activityHash,
      userId: user.id,
      activityType: singleActivity.activityType,
    });

    try {
      await this.databaseService.getPrismaClient().user.update({
        where: {
          id: user.id,
        },
        data: {
          phoneNumber: updatePhoneDto.phoneNumber,
        },
      });

      //create notification for the user
      // const newNotification = this.notificationProfileCreate(user);
      // await prisma.notification.create({
      //   data: newNotification,
      // });

      return;
    } catch (error) {
      console.error('Error occurred during phone number update:', error);
      throw error;
    }
  }

  async findUserWithPhone(phone: string) {
    const user = await this.databaseService.getPrismaClient().user.findFirst({
      where: {
        phoneNumber: phone,
      },
    });

    //return users.map(user => cleanUserResponse(user)); //TODO: only clean on controller end
    return user;
  }

  async forgotPasswordVerify(
    forgotPasswordVerificationDto: ForgotPasswordVerificationDto,
  ): Promise<ForgotVerifyPayload> {
    const { email } = forgotPasswordVerificationDto;
    const singleUser = await this.findUserWithEmail(
      forgotPasswordVerificationDto.email,
    );

    if (singleUser) {
      //
      const activityHash = await this.activityService.initiateUserActivity(
        ActivityEnumType.FORGOT_PASSWORD,
        singleUser.id,
      );

      const jwtAccessToken = generateJwtAccessToken({
        ipAddress: null,
        jwtService: this.jwtService,
        details: {
          id: singleUser.id,
          uid: singleUser.uid,
          email: singleUser.email,
          firstName: singleUser.firstName,
          lastName: singleUser.lastName,
          clientIp: null,
          active: singleUser.active,
          updatedAt: singleUser.updatedAt,
          createdAt: singleUser.createdAt,
        },
      });

      const jwtRefreshToken = generateJwtRefreshToken({
        accessToken: jwtAccessToken,
        jwtService: this.jwtService,
      });
      await this.otpService.sendUserEmailOtp(singleUser);
      const forgotPayloadInfo: ForgotVerifyPayload = {
        message:
          'You get a verification code to reset your password if your email is valid',
        foundUser: true,
        activityHash,
        userId: singleUser.id,
        accessToken: jwtAccessToken,
        refreshToken: jwtRefreshToken,
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
        accessToken: null,
        refreshToken: null,
      };
      return forgotPayloadInfo;
    }
  }

  async forgotPasswordUpdate(
    forgotPasswordUpdateDto: ForgotPasswordUpdateDto,
  ): Promise<void> {
    const user = await this.findOne(forgotPasswordUpdateDto.userId);

    const singleActivity = await this.activityService.verifyUserActivity(
      forgotPasswordUpdateDto.activityHash,
      user,
      this.activityService.getActivitiesUsage(ActivityEnumType.FORGOT_PASSWORD),
    );

    await this.activityService.updateActivityStatus({
      activityHash: singleActivity.activityHash,
      userId: user.id,
      activityType: singleActivity.activityType,
    });

    const hashedPassword = await generatePasswordHash(
      forgotPasswordUpdateDto.pwd,
    );

    try {
      await this.databaseService.getPrismaClient().user.update({
        where: {
          id: user.id,
        },
        data: {
          pass: hashedPassword,
        },
      });

      //create a new user notification
      // const newNotification = this.notificationProfileCreate(user);
      // await prisma.notification.create({
      //   data: newNotification,
      // });

      return;
    } catch (error) {
      console.error('Error occurred during password update:', error);
      throw error;
    }
  }

  async pushNotificationToken(
    deviceToken: string,
    user: GetUserDto,
  ): Promise<void> {
    try {
      const updatedUser = await this.databaseService
        .getPrismaClient()
        .user.update({
          where: { id: user.id },
          data: {
            pushNotificationToken: deviceToken,
          },
        });
    } catch (error) {
      throw error;
    }

    return;
  }
}
