import { CreateUserDto } from './create-user.dto';
import { UserRole } from '../users.entity';
declare const UpdateUserDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateUserDto>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
    token: string;
    password?: string;
    role?: UserRole;
    emailVerified?: boolean;
}
export {};
