import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          if (req.cookies?.refresh_token) return req.cookies.refresh_token;
          const auth = req.get('authorization');
          if (auth?.startsWith('Bearer ')) return auth.slice(7);
          return null;
        },
      ]),
      secretOrKey: process.env.JWT_REFRESH_SECRET || 'a',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const token =
      req.cookies?.refresh_token ??
      (req.get('authorization')?.startsWith('Bearer ') ? req.get('authorization')!.slice(7) : undefined);

    if (!token) throw new UnauthorizedException();
    return { userId: payload.sub, email: payload.email, refreshToken: token };
  }
}
