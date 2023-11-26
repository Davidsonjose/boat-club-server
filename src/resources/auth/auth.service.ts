import { Injectable, Logger } from '@nestjs/common';
import { AuthRefreshAccessTokenDto } from 'src/dto/auth/auth-token.dto';
import { GetUserDto, SignInUserDto } from 'src/dto/auth/user.dto';
import {
  decodeJwtAccessToken,
  generateJwtAccessToken,
  generateJwtRefreshToken,
  verifyJwtRefreshToken,
} from './common/auth.common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { systemResponses } from 'src/res/systemResponse';
import { verifyPasswordWithHash } from 'src/helpers/lib/characterGeneration';
import { ActivityService } from '../activity/activity.service';
import { ActivityEnumType } from 'src/dto/activity/activity.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private activityService: ActivityService,
  ) {}

  async login(authLoginDto: SignInUserDto & { ipAddress: string }) {
    try {
      const existingUsers = await this.userService.findAll({
        email: authLoginDto.email,
      });
      if (existingUsers.length === 0) {
        throw new Error(systemResponses.EN.LOGIN_FAILED);
      }
      const user = existingUsers[0];

      if (!user.active) {
        throw new Error(systemResponses.EN.USER_DEACTIVATED);
      }
      if (user.deleted) {
        throw new Error(systemResponses.EN.LOGIN_FAILED);
      }
      //lets check if the password matches
      const isValid = verifyPasswordWithHash(authLoginDto.pwd, user.pass);
      if (!isValid) {
        throw new Error(systemResponses.EN.LOGIN_FAILED);
      }

      //TODO: whenever updates are made on any of these values, please know that you can't rely on their JWT decrypted data until they login again
      //and if they keep refreshing the access toke, the stale data persists till the refresh token expires
      const jwtAccessToken = generateJwtAccessToken({
        ipAddress: authLoginDto.ipAddress,
        jwtService: this.jwtService,
        details: {
          id: user.id,
          uid: user.uid,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          clientIp: authLoginDto.ipAddress,
          active: user.active,
          updatedAt: user.updatedAt,
          createdAt: user.createdAt,
        },
      });

      const jwtRefreshToken = generateJwtRefreshToken({
        accessToken: jwtAccessToken,
        jwtService: this.jwtService,
      });
      const activityHash = await this.activityService.initiateUserActivity(
        ActivityEnumType.SIGNUP,
        user.id,
      );

      const {
        pin,
        pass,
        hash,
        deleted,
        active,
        // cryptoVaultId,
        // walletVaultId,
        ...others
      } = user;
      return {
        user: others,
        accessToken: jwtAccessToken,
        refreshToken: jwtRefreshToken,
        activityHash,
      };
    } catch (error) {
      throw error;
    }
  }

  async getNewAccessToken(
    refreshTokenDto: AuthRefreshAccessTokenDto & { ipAddress: string },
    user?: GetUserDto,
  ) {
    Logger.verbose('Refreshing access token');
    //need to find a way to store data per request without coupling with nestjs on service level
    try {
      const refreshPayload = verifyJwtRefreshToken({
        refreshToken: refreshTokenDto.refreshToken,
        jwtService: this.jwtService,
      });

      Logger.verbose('Refreshing access token 2');
      const userPayload = decodeJwtAccessToken({
        accessToken: refreshPayload.accessToken,
        ipAddress: refreshTokenDto.ipAddress,
        jwtService: this.jwtService,
      });

      Logger.verbose('Refreshing access token 3');
      const newAccessToken = generateJwtAccessToken({
        ipAddress: refreshTokenDto.ipAddress,
        jwtService: this.jwtService,
        details: {
          id: userPayload.id,
          uid: userPayload.uid,
          email: userPayload.email,
          firstName: userPayload.firstName,
          lastName: userPayload.lastName,
          clientIp: null,
          active: userPayload.active,
          updatedAt: userPayload.updatedAt,
          createdAt: userPayload.createdAt,
        },
      });

      console.log(userPayload, 'here from the accessToken');
      Logger.verbose('Refreshing access token 4');

      return {
        newAccessToken,
        refreshToken: refreshTokenDto.refreshToken,
      };
    } catch (err: any) {
      Logger.error('Failed to regenerate access token', err);
      throw new Error(
        `${systemResponses.EN.INVALID_SESSION} Error: ${err.message}`,
      );
    }
  }
}
