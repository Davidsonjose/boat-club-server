import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { ConfigService } from '@nestjs/config';
import {
  AirtimeTopUpExternal,
  AxiosRequestMethodEnum,
  BanicoopDetailsExternal,
  LoginExternalDto,
  LoginExternalSystemSpecPayload,
} from './dto';
import { CacheModule, CACHE_MANAGER } from '@nestjs/cache-manager';
import systemConfig, { SystemConfigDto } from 'src/config/systemConfig';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class SystemSpecSdk {
  baseURL: string;
  companyUid: string;
  companyDetails: BanicoopDetailsExternal;
  loginRoute: string;
  refreshTokenRoute: string;
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.baseURL = 'https://stagingapi.pouchii.net';
    this.refreshTokenRoute =
      '/identityservice/rest/api/authenticate/refresh/token';
    this.loginRoute =
      '/identityservice/rest/api/integration/authentication/credential';
    this.companyUid = 'd07bbfea-1607-4625-b8c2-6aef0c6142e2';
    this.companyDetails = {
      requestChannel: systemConfig().requestChannel,
      requestChannelId: systemConfig().requestChannelId,
      requestChannelType: systemConfig().requestChannelType,
      requestPartnerCode: systemConfig().requestPartnerCode,
      walletId: systemConfig().walletId,
      transactionPin: this.configService.get(SystemConfigDto.SYSTEM_SPEC_PIN),
    };
  }

  private async makeRequest(config: AxiosRequestConfig): Promise<any> {
    try {
      const accessToken = await this.getAccessTokenFromCache();
      const headers = {
        accept: 'application/json',
        authorization: `Bearer ${accessToken}`,
      };
      const response: AxiosResponse = await axios({ ...config, headers });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
  private async makeReques3(config: AxiosRequestConfig): Promise<any> {
    try {
      const accessToken = await this.getAccessTokenFromCache();
      const headers = {
        accept: 'application/json',
      };
      const response: AxiosResponse = await axios({ ...config, headers });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  private async makeRequest2(config: AxiosRequestConfig): Promise<any> {
    try {
      const accessToken = await this.getAccessTokenFromCache();
      const refreshToken = await this.getRefreshTokenFromCache();
      const headers = {
        accept: 'application/json',
        authorization: `Bearer ${accessToken}`,
        'Refresh-Authorization-Token': refreshToken,
      };
      const response: AxiosResponse = await axios({ ...config, headers });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  private async getAccessTokenFromCache(): Promise<string> {
    const cachedAccessToken = (await this.cacheManager.get(
      'access_token',
    )) as string;
    const decodedToken = this.decodeToken(cachedAccessToken);
    if (cachedAccessToken) {
      // Check if the token is expired, if expired, handle the refresh logic
      if (decodedToken.exp * 1000 < Date.now()) {
        const refreshedTokens = await this.refreshToken();
        return refreshedTokens.accessToken;
      }
      return cachedAccessToken;
    } else {
      // If no cached token, perform login and store the token in the cache
      const authDto = await this.loginSystemSpec();
      await this.cacheManager.set(
        'access_token',
        authDto.accessToken,
        decodedToken.exp * 1000 - Date.now(),
      );
      return authDto.accessToken;
    }
  }

  private async getRefreshTokenFromCache(): Promise<string> {
    const cachedRefreshToken = (await this.cacheManager.get(
      'refresh_token',
    )) as string;
    if (!cachedRefreshToken) {
      // If no cached refresh token, perform login and store the tokens in the cache
      const authDto = await this.loginSystemSpec();
      await this.cacheManager.set('access_token', authDto.accessToken);
      await this.cacheManager.set('refresh_token', authDto.refreshToken);
    }
    return cachedRefreshToken || '';
  }

  async loginSystemSpec() {
    try {
      const { transactionPin, ...others } = this.companyDetails;

      const authdetails: LoginExternalDto = {
        username: this.configService.get(SystemConfigDto.SYSTEM_SPEC_USER),
        password: this.configService.get(SystemConfigDto.SYSTEM_SPEC_PASS),
      };
      const info = await this.makeReques3({
        method: AxiosRequestMethodEnum.POST,
        url: `${this.baseURL}${this.loginRoute}`,
        data: {
          ...others,
          authdetails,
        },
      });
      const accessToken = info?.data?.data?.authorization?.token;
      const refreshToken = info?.data?.data?.authorization?.refreshToken;

      const authDto: LoginExternalSystemSpecPayload = {
        accessToken,
        refreshToken,
      };
      return authDto;
    } catch (error) {
      throw error;
    }
  }

  async refreshToken() {
    try {
      const info = await this.makeRequest2({
        method: AxiosRequestMethodEnum.POST,
        url: `${this.baseURL}${this.refreshTokenRoute}`,
      });
      const accessToken = info?.data?.data?.authorization?.token;
      const refreshToken = info?.data?.data?.authorization?.refreshToken;

      const authDto: LoginExternalSystemSpecPayload = {
        accessToken,
        refreshToken,
      };
      return authDto;
    } catch (error) {
      throw error;
    }
  }

  decodeToken(token: string): any {
    // Implement your JWT decoding logic here
    // You can use libraries like 'jsonwebtoken' for decoding JWT tokens
    // Example: jwt.verify(token, 'your-secret-key');

    const payload = this.jwtService.decode(token);
    console.log(payload);
    return payload;
  }

  async airtimeTopUp(info: AirtimeTopUpExternal) {
    try {
      return this.makeRequest({
        method: AxiosRequestMethodEnum.POST,
        url: `${this.baseURL}/transactionservice/rest/api/airtime/topup/payment`,
        data: {
          ...this.companyDetails,
          info,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getDataPlans(billerId: number) {
    return this.makeRequest({
      method: AxiosRequestMethodEnum.GET,
      url: `${this.baseURL}/vas/rest/api/fetch/${billerId}/data/plans`,
    });
  }
}
