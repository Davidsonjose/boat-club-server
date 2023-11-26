import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { IpInfo } from './ipwhois.dto';

@Injectable()
export default class IpwhoisService {
  private baseApiUrl = 'http://ipwho.is';

  constructor() {}

  async getIpInfo(ipAddress: string) {
    try {
      const ip =
        ipAddress === '::1' || ipAddress === '127.0.0.1'
          ? '102.216.183.15'
          : ipAddress;
      const resp = await axios.get(`${this.baseApiUrl}/${ip}`, {});
      const response: IpInfo = resp.data;
      return response;
    } catch (err: any) {
      Logger.error(`Failed to get location details for IP: ${ipAddress}`, err);
      throw new Error(
        `Failed to retrieve location your IP location data. We don't mind aliens, but we support only earthlings for now 😊`,
      );
    }
  }
}
