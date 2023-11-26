import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getClientIp } from 'request-ip';
import { SystemConfigDto } from 'src/config/systemConfig';

@Injectable()
export class HttpGuard implements CanActivate {
  @Inject()
  private configService: ConfigService;

  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<any>();

    /* Getting the client IP address and checking if it is in the blacklist. */
    let clientIp = getClientIp(request);

    const env =
      this.configService.get<string | undefined>(SystemConfigDto.STAGE) ??
      'dev';

    if (env === 'dev' || env === 'stg') {
      clientIp =
        clientIp === '::1' || clientIp === '127.0.0.1'
          ? '102.216.183.15'
          : clientIp;
    }

    if (!clientIp) {
      throw new UnauthorizedException(
        'We cannot allow this request. Unrecognised device type',
      );
    }

    request.requestState = {
      active: false,
      clientIp,
      createdAt: new Date(),
      email: '',
      firstName: '',
      isDeveloper: false,
      id: 0,
      lastName: '',
      uid: '',
      updatedAt: new Date(),
    };

    return true;
  }
}
