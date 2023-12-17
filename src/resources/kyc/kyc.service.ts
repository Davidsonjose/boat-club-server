import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { DatabaseService } from 'src/services/database/database.service';
import { GetUserDto } from 'src/dto/auth/user.dto';
import { Kyc, KycVerificationStatus } from '@prisma/client';
import { KycOneDto, KycThreeDto, KycTwoDto, kycLevelEnum } from 'src/dto/kyc';

@Injectable()
export class kycService {
  constructor(
    private userService: UserService,
    private databaseService: DatabaseService,
  ) {}

  async getKyc(userId: number) {
    try {
      return await this.databaseService.getPrismaClient().kyc.findFirst({
        where: { userId },
        include: {
          Tier1: true,
          Tier2: true,
          Tier3: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async initializeUserKyc(user: GetUserDto) {
    try {
      const kyc = await this.databaseService.getPrismaClient().kyc.create({
        data: {
          //   userId: user.id, // Assuming you have user id in GetUserDto
          User: {
            connect: { id: user.id },
          },
        },
      });

      // Create Tier1 associated with the Kyc
      const Tier1 = await this.databaseService.getPrismaClient().tier1.create({
        data: {
          //   phoneNumber: user.phoneNumber,
          email: user.email,
          kycId: kyc.id,
        },
      });

      // Create Tier2 associated with the Kyc
      const Tier2 = await this.databaseService.getPrismaClient().tier2.create({
        data: {
          address: '', // Assuming you have address in GetUserDto
          faceVerificationUrl: '', // Assuming you have faceVerificationUrl in GetUserDto
          kycId: kyc.id,
        },
      });

      // Create Tier3 associated with the Kyc
      const Tier3 = await this.databaseService.getPrismaClient().tier3.create({
        data: {
          //   bvn: user.bvn, // Assuming you have bvn in GetUserDto
          kycId: kyc.id,
        },
      });

      // Update Kyc with Tier references
      await this.databaseService.getPrismaClient().kyc.update({
        where: { id: kyc.id },
        data: {
          Tier1: { connect: { id: Tier1.id } },
          Tier2: { connect: { id: Tier2.id } },
          Tier3: { connect: { id: Tier3.id } },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  //   async startFullKyc(kycLevel: kycLevelEnum, user: GetUserDto) {
  //     try {
  //       // const fullKyc =
  //       if (kycLevel == kycLevelEnum.TIER_ONE) {
  //         return await this.startKyc1()
  //       }
  //     } catch (error) {
  //       throw error;
  //     }
  //   }

  async startKyc1(kycOneDto: KycOneDto) {
    const { phoneNumber, userId } = kycOneDto;
    try {
      // Check if the user exists
      const user = await this.getUserWithKyc(userId);

      if (!user) {
        throw new BadRequestException('User not found');
      }
      //   const kycdetails = await this.getKycDetails(user.Kyc.id);
      await this.handleKycVerificationValidation(
        kycLevelEnum.TIER_TWO,
        user.Kyc.id,
      );

      // Update Tier1 associated with the user's Kyc
      const tier1 = await this.databaseService.getPrismaClient().tier1.update({
        where: { kycId: user.Kyc.id },
        data: {
          phoneNumber: phoneNumber,
          email: user.email,
          emailVerified: true, // You may want to handle email verification separately
          phoneVerified: true, // You may want to handle phone verification separately
          kycSubmitted: true,
          verificationStatus: 'VERIFIED' as KycVerificationStatus, // Update verification status as needed
        },
      });

      return tier1;
    } catch (error) {
      throw error;
    }
  }

  async startKyc2(kycTwoDto: KycTwoDto) {
    try {
      const { address, userId, faceVerificationUrl } = kycTwoDto;
      // Check if the user exists
      const user = await this.getUserWithKyc(userId);

      const kycdetails = await this.getKycDetails(user.Kyc.id);

      await this.handleKycVerificationValidation(
        kycLevelEnum.TIER_TWO,
        kycdetails.id,
      );

      if (kycdetails.Tier2.trial == 3) {
        throw new BadRequestException(
          'Please contact support, you account has reached it limit of verification',
        );
      }
      // Update Tier2 associated with the user's Kyc
      const Tier2 = await this.databaseService.getPrismaClient().tier2.update({
        where: { kycId: user.Kyc.id },
        data: {
          address: address,
          faceVerificationUrl: faceVerificationUrl,
          faceVerified: false, // You may want to handle face verification separately
          addressVerified: false, // You may want to handle address verification separately
          kycSubmitted: true,
          trial: kycdetails.Tier2.trial + 1,
          verificationStatus: 'PENDING' as KycVerificationStatus, // Update verification status as needed
        },
      });

      return Tier2;
    } catch (error) {
      throw error;
    }
  }

  async startKyc3(kycThreeDto: KycThreeDto) {
    try {
      const { bvn, userId } = kycThreeDto;
      // Check if the user exists
      const user = await this.getUserWithKyc(userId);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      if (user.Kyc.Tier3.trial == 3) {
        throw new BadRequestException(
          'Please contact support, you account has reached it limit of verification',
        );
      }

      // Update Tier3 associated with the user's Kyc
      const Tier3 = await this.databaseService.getPrismaClient().tier3.update({
        where: { kycId: user.Kyc.id },
        data: {
          bvn: bvn,
          bvnVerified: false, // You may want to handle BVN verification separately
          kycSubmitted: true,
          trial: user.Kyc.Tier3.trial + 1,
          verificationStatus: 'VERIFIED' as KycVerificationStatus, // Update verification status as needed
        },
      });

      return Tier3;
    } catch (error) {
      throw error;
    }
  }

  async getKycDetails(kycId: number) {
    try {
      const details = await this.databaseService
        .getPrismaClient()
        .kyc.findFirst({
          where: { id: kycId },
          include: {
            Tier1: true,
            Tier2: true,
            Tier3: true,
          },
        });
      return details;
    } catch (error) {
      throw error;
    }
  }

  async handleKycVerificationValidation(kycLevel: kycLevelEnum, kycId: number) {
    try {
      const kycdetails = await this.getKycDetails(kycId);
      if (kycLevel == kycLevelEnum.TIER_ONE) {
        if (
          kycdetails.Tier1.verificationStatus == KycVerificationStatus.PENDING
        ) {
          throw new BadRequestException(
            'Your verification process is ongoing. You will get a update soon',
          );
        } else if (
          kycdetails.Tier1.verificationStatus == KycVerificationStatus.FAILED
        ) {
          throw new BadRequestException(
            'Your kyc verification failed. Please contact support',
          );
        } else if (
          kycdetails.Tier1.verificationStatus ==
          KycVerificationStatus.SUCCESSFUL
        ) {
          throw new BadRequestException(
            'Your kyc verification has been completed',
          );
        } else {
          return;
        }
      } else if (kycLevel == kycLevelEnum.TIER_TWO) {
        if (
          kycdetails.Tier2.verificationStatus == KycVerificationStatus.PENDING
        ) {
          throw new BadRequestException(
            'Your verification process is ongoing. You will get a update soon',
          );
        } else if (
          kycdetails.Tier2.verificationStatus == KycVerificationStatus.FAILED
        ) {
          throw new BadRequestException(
            'Your kyc verification failed. Please contact support',
          );
        } else if (
          kycdetails.Tier2.verificationStatus ==
          KycVerificationStatus.SUCCESSFUL
        ) {
          throw new BadRequestException(
            'Your kyc verification has been completed',
          );
        } else {
          return;
        }
      } else if (kycLevel == kycLevelEnum.TIER_THREE) {
        if (
          kycdetails.Tier3.verificationStatus == KycVerificationStatus.PENDING
        ) {
          throw new BadRequestException(
            'Your verification process is ongoing. You will get a update soon',
          );
        } else if (
          kycdetails.Tier3.verificationStatus == KycVerificationStatus.FAILED
        ) {
          throw new BadRequestException(
            'Your kyc verification failed. Please contact support',
          );
        } else if (
          kycdetails.Tier3.verificationStatus ==
          KycVerificationStatus.SUCCESSFUL
        ) {
          throw new BadRequestException(
            'Your kyc verification has been completed',
          );
        } else {
          return;
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async getUserWithKyc(userId: number) {
    try {
      const user = await this.databaseService.getPrismaClient().user.findFirst({
        where: { id: userId },
        include: {
          Kyc: { include: { Tier1: true, Tier2: true, Tier3: true } },
        },
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
}
