import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import * as bcrypt from 'bcrypt';
import { User, UserRole } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { MailService } from '../mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly mailService: MailService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private async hashPassword(plain: string) {
    const rounds = 12;
    return bcrypt.hash(plain, rounds);
  }

  private buildEmailVerifyToken(userId: string, email: string) {
    return this.jwtService.sign(
      { sub: userId, email },
      {
        secret: this.configService.get<string>('JWT_EMAIL_VERIFY_SECRET'),
        expiresIn: '24h',
        audience: 'email-verify',
        issuer: 'test-app',
      },
    );
  }

  async create(dto: CreateUserDto) {
    const exists = await this.usersRepository.findOne({ where: { email: dto.email } });
    if (exists) throw new BadRequestException('Email already in use');

    const user = this.usersRepository.create({
      email: dto.email.toLowerCase(),
      password: await this.hashPassword(dto.password), // Hash password
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role ?? UserRole.STUDENT, // Lowest role by default
      profileData: dto.profileData,
      emailVerified: false, // Unverified by default
    });

    const saved = await this.usersRepository.save(user);

    const token = this.buildEmailVerifyToken(user.id, user.email);
    const verifyUrl = `${this.configService.get<string>('FRONTEND_URL')}/verify-email?token=${token}`;

    await this.mailService.sendMail(
      user.email,
      'Verify your EduCollab account',
      `<h1>Welcome to EduCollab!</h1>
       <p>Click below to verify your email:</p>
       <a href="${verifyUrl}" target="_blank">Verify Email</a>
       <p>This link will expire in 24 hours.</p>`
    );

    delete (saved as any).password;
    return saved;
  }
  
  async update(id: string, dto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (dto.email && dto.email.toLowerCase() !== user.email) {
      const exists = await this.usersRepository.findOne({ where: { email: dto.email.toLowerCase() } });
      if (exists) throw new BadRequestException('Email already in use');
      user.email = dto.email.toLowerCase();
    }

    if (dto.password) user.password = await this.hashPassword(dto.password);
    if (dto.firstName !== undefined) user.firstName = dto.firstName;
    if (dto.lastName !== undefined) user.lastName = dto.lastName;
    if (dto.role !== undefined) user.role = dto.role;
    if (dto.profileData !== undefined) user.profileData = dto.profileData;
    if (dto.emailVerified !== undefined) user.emailVerified = dto.emailVerified;

    await this.usersRepository.save(user);
    delete (user as any).password;
    return user;
  }

  async findOne(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmailWithPassword(email: string) {
    return this.usersRepository
      .createQueryBuilder('u')
      .addSelect('u.password') // Selection is disabled by default
      .where('u.email = :email', { email })
      .getOne();
  }

  async findByIdWithPassword(id: string) {
    return this.usersRepository
      .createQueryBuilder('u')
      .addSelect('u.password')
      .where('u.id = :id', { id })
      .getOne();
  }
  
  async updatePassword(userId: string, passwordHash: string) {
    await this.usersRepository.update({ id: userId }, { password: passwordHash });
  }

  async setEmailVerifyToken(id: string, data: { emailVerifyTokenHash: string; emailVerifyTokenExpires: Date }) {
    
  }

  async clearEmailVerifyToken(id: string) {
    
  }

  async findUserByVerifyTokenNotExpired() {
    
  }

  async markEmailVerified(id: string) {
    await this.usersRepository.update({ id }, { emailVerified: true });
  }
}
