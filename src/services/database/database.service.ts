import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async onModuleInit() {
    // No need to explicitly call $connect; PrismaClient handles it internally.
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }

  getPrismaClient() {
    return this.prisma;
  }
}
