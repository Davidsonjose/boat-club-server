import { Injectable, Logger } from '@nestjs/common';
import * as cron from 'node-cron';
import axios from 'axios';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor() {
    this.schedulePingTask();
  }

  private schedulePingTask() {
    cron.schedule('1 * * * * *', async () => {
      this.logger.log('Pinging the server at ' + new Date());

      try {
        // Make a ping request to your server
        const response = await axios.get(
          'https://quixcel-estates-server-0a61bd1c8d09.herokuapp.com/api/v1/cron/ping',
        ); // Adjust the URL as needed
        this.logger.verbose('Ping response: active');
      } catch (error) {
        this.logger.error('Ping request failed:', error);
      }
    });
  }
}
