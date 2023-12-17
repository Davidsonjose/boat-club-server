import { Module } from '@nestjs/common';
import { SystemSpecService } from './Systemspec.service';
import { SystemSpecSdk } from './Systemspec.controller';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register(), ConfigModule],
  providers: [SystemSpecService, SystemSpecSdk],
  controllers: [],
  exports: [SystemSpecService, SystemSpecSdk],
})
export class SystemSpecModule {}
