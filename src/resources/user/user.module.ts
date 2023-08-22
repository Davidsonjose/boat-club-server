import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { UserRepository } from 'src/repository/user.repository';
import { LocationModule } from '../location/location.module';
import { SettingsModule } from '../settings/settings.module';
import { PassportModule } from '@nestjs/passport';
import { ActivityModule } from '../activity/activity.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    LocationModule,
    SettingsModule,
    ActivityModule,
  ],
  providers: [UserService, UserRepository],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
