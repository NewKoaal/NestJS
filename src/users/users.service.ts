import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import { User, UserRole } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private async hashPassword(plain: string) {
    const rounds = 12;
    return bcrypt.hash(plain, rounds);
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
    
  }
}
