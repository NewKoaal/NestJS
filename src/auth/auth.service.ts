import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

const RESET_TTL = '15m';

function shortChecksum(str: string) {
  return crypto.createHash('sha256').update(str).digest('hex').slice(0, 16);
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmailWithPassword(email);

    if (user) {
      const ok = await bcrypt.compare(pass, user.password);
      if (!ok) throw new UnauthorizedException('Invalid credentials');

      delete (user as any).password;
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'a',
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'a',
      expiresIn: '7d',
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'a',
      });
      const user = await this.usersService.findByEmailWithPassword(payload.email);
      if (!user) throw new UnauthorizedException();

      const newAccessToken = this.jwtService.sign(
        { email: user.email, sub: user.id },
        { secret: process.env.JWT_SECRET || 'a', expiresIn: '1h' },
      );

      return { access_token: newAccessToken };
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async requestPasswordReset(email: string) {
    const userWithPass = await this.usersService.findByEmailWithPassword(email);
    if (!userWithPass) return;

    const passChecksum = shortChecksum(userWithPass.password);

    const token = this.jwtService.sign(
      {
        sub: userWithPass.id,
        email: userWithPass.email,
        prc: passChecksum,
      },
      {
        secret: process.env.JWT_RESET_SECRET || 'a',
        expiresIn: RESET_TTL,
        audience: 'password-reset',
        issuer: 'test-app',
      },
    );

    const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await this.mailService.sendMail(
      userWithPass.email,
      'Reset your password',
      `<h1>Welcome to EduCollab!</h1>
       <p>Click below to reset your password:</p>
       <a href="${link}" target="_blank">Reset password</a>
       <p>This link will expire in 24 hours.</p>`
    );

    return token;
  }

  async resetPasswordWithToken(token: string, newPassword: string) {
    let payload: any;
    try {
      payload = this.jwtService.verify(token, {
        secret: process.env.JWT_RESET_SECRET || 'a',
        audience: 'password-reset',
        issuer: 'test-app',
      });
    } catch {
      throw new BadRequestException('Invalid or expired token');
    }

    const userWithPass = await this.usersService.findByIdWithPassword(payload.sub);
    if (!userWithPass) throw new BadRequestException('Invalid token');

    const currentChecksum = shortChecksum(userWithPass.password);
    if (currentChecksum !== payload.prc) {
      throw new BadRequestException('Invalid or expired token');
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await this.usersService.updatePassword(userWithPass.id, newHash);

    return { ok: true };
  }

  async verifyEmailWithToken(token: string) {
    let payload: any;
    try {
      payload = this.jwtService.verify(token, {
        secret: process.env.JWT_EMAIL_VERIFY_SECRET || 'a',
        audience: 'email-verify',
        issuer: 'test-app',
      });
    } catch {
      throw new BadRequestException('Invalid or expired token');
    }

    await this.usersService.markEmailVerified(payload.sub);
    return { ok: true };
  }
}
