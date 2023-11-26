import {
  Injectable,
  CanActivate,
  Inject,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verifyJwtAccessToken } from 'src/resources/auth/common/auth.common';

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject()
  private jwtService: JwtService;

  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<any>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Invalid authorization');
      // throw new UnauthorizedException("Expected Auth Format: Bearer <token>");
    }
    try {
      const payload = verifyJwtAccessToken({
        accessToken: token,
        ipAddress: request.requestState.clientIp,
        jwtService: this.jwtService,
      });

      //TODO: should isDeveloper be false by default?
      request.requestState = {
        ...payload,
        clientIp: request.requestState.clientIp ?? '',
      };
    } catch {
      throw new UnauthorizedException(
        'Your authorization could not be validated. Token is either expired or invalid',
      );
    }
    return true;
  }

  private extractTokenFromHeader(request): string | undefined {
    const [type, token] =
      (request.headers.authorization as string)?.split(' ') ?? [];

    return type?.toLowerCase() === 'bearer' ? token : undefined;
  }
}
