import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthController {
    private readonly authService;
    private readonly userService;
    constructor(authService: AuthService, userService: UsersService);
    register(dto: CreateUserDto): Promise<import("../users/users.entity").User>;
    login(req: any): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    refresh(req: any): Promise<{
        access_token: string;
    }>;
    logout(req: any): Promise<any>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        ok: boolean;
        token: string | undefined;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        ok: boolean;
    }>;
    verifyEmail(dto: VerifyEmailDto): Promise<{
        ok: boolean;
    }>;
}
