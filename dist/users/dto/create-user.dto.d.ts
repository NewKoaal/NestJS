import { UserRole } from '../users.entity';
export declare class CreateUserDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    profileData?: Record<string, any>;
}
