import { Injectable, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthRepository } from 'src/repository/auth.repository';
import { LocationModule } from '../location/location.module';
import { SettingsModule } from '../settings/settings.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { RefreshToken } from './refreshToken.entity';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './jwt.strategy';
import { UserRepository } from 'src/repository/user.repository';
import { CompanyModule } from '../company/company.module';
import { ActivityModule } from '../activity/activity.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'jwt-secret',
    }),
    TypeOrmModule.forFeature([User, RefreshToken]),
    LocationModule,
    SettingsModule,
    CompanyModule,
    ActivityModule,
    // UserModule,
  ],
  providers: [
    AuthService,
    AuthRepository,
    UserService,
    JwtStrategy,
    UserRepository,
  ],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule, AuthService],
})
export class AuthModule {}
