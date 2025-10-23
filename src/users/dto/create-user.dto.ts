import { IsEmail, IsEnum, IsOptional, IsString, MinLength, Matches } from 'class-validator';
import { UserRole } from '../users.entity';

export class CreateUserDto {
    @IsEmail() email: string;
  
    @IsString() @MinLength(8)
    @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/, {
        message: 'Password must contain at least one uppercase letter, one number, and one special character',
    })
    password: string;
  
    @IsString() firstName: string;
  
    @IsString() lastName: string;
  
    @IsEnum(UserRole) role: UserRole;
  
    @IsOptional() profileData?: Record<string, any>;
}