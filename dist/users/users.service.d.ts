import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    private hashPassword;
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
