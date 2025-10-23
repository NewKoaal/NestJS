import { Controller, Get, Patch, Req, Body, Param, UseGuards } from '@nestjs/common';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('/profile')
  update(@Req() req, @Body() dto: UpdateUserDto) {
    return this.usersService.update(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  findOne(@Req() req) {
    return this.usersService.findOne(req.user.id);
  }
}
