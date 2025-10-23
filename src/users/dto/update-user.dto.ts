import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEnum, IsOptional, IsString, MinLength, IsBoolean } from 'class-validator';
import { UserRole } from '../users.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString() token!: string;
    
    @IsString() @MinLength(8) @IsOptional() password?: string;
  
    @IsEnum(UserRole) @IsOptional() role?: UserRole;
  
    @IsBoolean() @IsOptional() emailVerified?: boolean;
}