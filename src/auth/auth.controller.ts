import { Controller, Request, Get, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/register')
  async register(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('/refresh')
  async refresh(@Request() req) {
    return this.authService.refresh(req.token);
  }

  @Post('/logout')
  async logout(@Request() req) {
    return req.logout();
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    const token = await this.authService.requestPasswordReset(dto.email);
    return { ok: true, token };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPasswordWithToken(dto.token, dto.newPassword);
    return { ok: true };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/verify-email')
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    await this.authService.verifyEmailWithToken(dto.token);
    return { ok: true };
  }
}
