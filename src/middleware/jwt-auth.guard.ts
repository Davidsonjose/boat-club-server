import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AllowExpiredJwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const accessToken = request.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

    if (!accessToken) {
      return false;
    }

    try {
      const payload = this.jwtService.decode(accessToken); // Use decode instead of verify
      if (!payload) {
        return false;
      }
      request.user = payload; // Set the user object on the request
      return true;
    } catch (error) {
      return false;
    }
  }
}
