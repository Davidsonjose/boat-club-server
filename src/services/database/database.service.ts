import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { SystemConfigDto } from 'src/config/systemConfig';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private prisma: PrismaClient;

  constructor(private configService: ConfigService) {
    this.prisma = new PrismaClient();
  }

  async onModuleInit() {
    await this.initialize();
    // No need to explicitly call $connect; PrismaClient handles it internally.
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }

  async initialize() {
    try {
      this.prisma = new PrismaClient({
        datasourceUrl:
          'postgresql://bolt_club_user:HMN5PcrufgsQKQLbkuMRQz2sWG2TyxWS@dpg-csgnpvij1k6c73cdtru0-a.frankfurt-postgres.render.com/bolt_club',
      });
      await this.validateConnection();
      console.log('connected');
    } catch (err: any) {
      throw new InternalServerErrorException('Datastore is offline', {
        cause: err,
      });
    }
  }

  private async validateConnection() {
    try {
      this.prisma.user.count();
    } catch (err: any) {
      Logger.error('Failed to run the validation database count query', err);
      throw err;
    }
  }
  getPrismaClient() {
    return this.prisma;
  }

  prismaDatabase() {
    return this.getPrismaClient();
  }
}
