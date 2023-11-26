import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import systemConfig from 'src/config/systemConfig';
import { IRequestState } from 'src/dto/auth/auth-token.dto';
import { decrypt, twoWayencrypt } from 'src/helpers/cryptography';

export type JWTUserDeveloperPayload = IRequestState;

export type JWTRefreshTokenPayload = {
  accessToken: string;
};

export function generateJwtAccessToken(data: {
  jwtService: JwtService;
  ipAddress: string; //if your IP address changes, your token becomes invalid
  details: JWTUserDeveloperPayload;
}) {
  const signageToken = data.jwtService.sign(data.details, {
    expiresIn: systemConfig().JWT_AUTH_EXPIRE,
    secret: systemConfig().JWT_SALT + data.ipAddress,
  });
  const accessToken = twoWayencrypt(signageToken);
  return accessToken;
}

export function verifyJwtAccessToken(data: {
  jwtService: JwtService;
  ipAddress: string; //if your IP address changes, your token becomes invalid
  accessToken: string;
}) {
  try {
    const signageToken = decrypt(data.accessToken);
    const payload = data.jwtService.verify(signageToken, {
      secret: systemConfig().JWT_SALT + data.ipAddress,
    });
    //will throw error if verification failed
    return payload as IRequestState;
  } catch (err: any) {
    Logger.error('Failed to perform jwt a verification.', err);
    throw new Error(`Failed to verify request. Error: ${err.message}`);
  }
}

export function decodeJwtAccessToken(data: {
  jwtService: JwtService;
  ipAddress: string; //if your IP address changes, your token becomes invalid
  accessToken: string;
}) {
  try {
    const signageToken = decrypt(data.accessToken);
    const payload = data.jwtService.decode(signageToken);
    return payload as IRequestState;
  } catch (err: any) {
    Logger.error('Failed to decode JWT token', err);
    throw new Error(
      `Failed to transform request crendentials. Error: ${err.message}`,
    );
  }
}

export function generateJwtRefreshToken(data: {
  jwtService: JwtService;
  accessToken: string;
}) {
  const signageToken = data.jwtService.sign(
    { accessToken: data.accessToken },
    {
      expiresIn: systemConfig().JWT_REFRESH_EXPIRE,
      secret: systemConfig().JWT_SALT, //refresh token can work across multiple IP addresses, but if the user's city changes, we must invalidate their refresh token
    },
  );
  const refreshToken = twoWayencrypt(signageToken);
  return refreshToken;
}

export function verifyJwtRefreshToken(data: {
  jwtService: JwtService;
  refreshToken: string;
}) {
  try {
    const signageToken = decrypt(data.refreshToken);
    const payload = data.jwtService.verify(signageToken, {
      secret: systemConfig().JWT_SALT,
    });
    //will throw error if verification failed
    return payload as JWTRefreshTokenPayload;
  } catch (err: any) {
    Logger.error('Failed to perform jwt r verification.', err);
    throw new Error(`Failed to verify request. Error: ${err.message}`);
  }
}
