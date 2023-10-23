import { Injectable, Logger } from '@nestjs/common';
import * as cron from 'node-cron';
import axios from 'axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { Repository } from 'typeorm';
import { Settings } from '../settings/settings.entity';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Settings)
    private readonly settingsRepository: Repository<Settings>,
  ) {
    // this.schedulePingTask();
  }

  //   private schedulePingTask() {
  //     cron.schedule('1 * * * * *', async () => {
  //       this.logger.log('Pinging the server at ' + new Date());

  //       try {
  //         // Make a ping request to your server
  //         const response = await axios.get(
  //           'https://quixcel-estates-server-0a61bd1c8d09.herokuapp.com/api/v1/cron/ping',
  //         ); // Adjust the URL as needed
  //         this.logger.verbose('Ping response: active');
  //       } catch (error) {
  //         this.logger.error('Ping request failed:', error);
  //       }
  //     });
  //   }

  @Cron(CronExpression.EVERY_MINUTE)
  async handlePingTask() {
    this.logger.log('Pinging the server at ' + new Date());

    try {
      await axios.get(
        'https://quixcel-estates-server-0a61bd1c8d09.herokuapp.com/api/v1/cron/ping',
      ); // Adjust the URL as needed
      this.logger.verbose('Ping response: active');
    } catch (error) {
      this.logger.error('Ping request failed:', error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async resetInviteLimits() {
    this.logger.log('Resetting invite limits for all users at ' + new Date());

    // Update the daily invite limit to 0 for all users in a single query
    await this.settingsRepository
      .createQueryBuilder()
      .update(Settings)
      .set({ inviteLimit: 0 })
      .execute();

    this.logger.verbose('Invite limits reset successfully.');
  }

  //   @Cron(CronExpression.EVERY_SECOND)
  //   async handle10() {
  //     this.logger.verbose('Ping response: active');
  //   }
}
