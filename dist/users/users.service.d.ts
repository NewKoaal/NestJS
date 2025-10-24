import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MailService } from '../mail/mail.service';
export declare class UsersService {
    private usersRepository;
    private readonly mailService;
    private jwtService;
    private configService;
    constructor(usersRepository: Repository<User>, mailService: MailService, jwtService: JwtService, configService: ConfigService);
    private hashPassword;
    private buildEmailVerifyToken;
    create(dto: CreateUserDto): Promise<User>;
    update(id: string, dto: UpdateUserDto): Promise<User>;
    findOne(email: string): Promise<User>;
    findByEmailWithPassword(email: string): Promise<User | null>;
    findByIdWithPassword(id: string): Promise<User | null>;
    updatePassword(userId: string, passwordHash: string): Promise<void>;
    setEmailVerifyToken(id: string, data: {
        emailVerifyTokenHash: string;
        emailVerifyTokenExpires: Date;
    }): Promise<void>;
    clearEmailVerifyToken(id: string): Promise<void>;
    findUserByVerifyTokenNotExpired(): Promise<void>;
    markEmailVerified(id: string): Promise<void>;
}
