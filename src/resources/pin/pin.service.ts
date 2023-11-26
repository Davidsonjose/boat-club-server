import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { ActivityService } from '../activity/activity.service';
import { DatabaseService } from 'src/services/database/database.service';
import {
  ActivityUsageEnum,
  GetUserDto,
  UpdatePinDto,
  VerifyPinDto,
} from 'src/dto/auth/user.dto';
import { ActivityEnumType } from 'src/dto/activity/activity.dto';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class PinService {
  constructor(
    private databaseService: DatabaseService,
    private activityService: ActivityService,
    private walletService: WalletService,
  ) {}

  // @Inject()
  async updatePin(
    user: GetUserDto,
    updatePinDto: UpdatePinDto,
  ): Promise<boolean> {
    if (!user) {
      throw new BadRequestException('Invalid user type');
    }
    const detailedUser = await this.databaseService.user.findFirst({
      where: { id: user.id },
    });

    const singleActivity = await this.activityService.getSingleActivity(
      updatePinDto.activityHash,
      user.id,
    );

    const verifyHashInfo = {
      userId: user.id,
      activityType: singleActivity.activityType as ActivityEnumType,
      activityHash: updatePinDto.activityHash,
    };

    await this.activityService.verifyActivityHash(verifyHashInfo);
    await this.activityService.verifyActivityUsage({
      activityHash: updatePinDto.activityHash,
      userId: user.id,
      activityUsage: ActivityUsageEnum.TWO_AUTHENTICATION,
    });

    const hashedPin = await this.hashPin(updatePinDto.pin);

    try {
      if (detailedUser.hasPin == false) {
        const loanWallet = await this.walletService.createLoanWallet(user);
        const savingsWallet = await this.walletService.savingsWallet(user);
        const mainWallet = await this.walletService.mainWallet(user);
        await this.databaseService.user.update({
          where: { id: user.id },
          data: {
            pin: hashedPin,
            hasPin: true,
            // cryptoVaultId: Number(info.createdVault.id),
            // digitalVaultId: Number(infodigital.original.id),
          },
        });
      } else {
        await this.databaseService.user.update({
          where: { id: user.id },
          data: {
            pin: hashedPin,
            hasPin: true,
          },
        });
      }

      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async verifyPin(
    userdetails: GetUserDto,
    verifyPinDto: VerifyPinDto,
  ): Promise<boolean> {
    const user = await this.databaseService.user.findUnique({
      where: { id: userdetails.id },
    });
    const { activityHash } = verifyPinDto;
    if (!user || !user.pin) {
      throw new BadRequestException('Incorrect pin');
    }
    if (verifyPinDto.activityHash) {
      const singleActivity = await this.activityService.verifyUserActivity(
        activityHash,
        user,
        ActivityUsageEnum.TWO_AUTHENTICATION,
      );
      await this.activityService.updateActivityStatus({
        activityHash,
        userId: user.id,
        activityType: singleActivity.activityType,
      });
      const isPinValid = await bcrypt.compare(verifyPinDto.pin, user.pin);

      if (isPinValid == false) {
        throw new BadRequestException('Incorrect pin');
      }
      return isPinValid;
    } else {
      const isPinValid = await bcrypt.compare(verifyPinDto.pin, user.pin);

      if (isPinValid == false) {
        throw new BadRequestException('Incorrect pin');
      }
      return isPinValid;
    }
  }

  private async hashPin(pin: string): Promise<string> {
    const saltRounds = 10;
    const hashedPin = await bcrypt.hash(pin, saltRounds);
    return hashedPin;
  }
}
