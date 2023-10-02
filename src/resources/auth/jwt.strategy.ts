import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'jwt-secret',
    });
  }

  async validate(payload: { sub: string; companyId: number }) {
    const user = await this.userService.getSingleUser(
      payload.sub,
      'auth',
      payload.companyId,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }
}
