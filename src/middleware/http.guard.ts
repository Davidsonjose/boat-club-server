import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class HttpGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    /* Getting the client IP address and checking if it is in the blacklist. */
    const clientIp =
      request.headers['x-forwarded-for'] || request.connection.remoteAddress;

    if ((process.env?.ENV ?? 'dev') === 'dev') {
      // You can add your development IP address handling here if needed.
    }

    if (!clientIp) {
      throw new UnauthorizedException(
        'We cannot allow this request. Unrecognized device type',
      );
    }

    request.clientState = {
      ipAddress: '',
    };
    request.clientState.ipAddress = clientIp;

    return true;
  }
}
