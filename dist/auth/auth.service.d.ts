import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    refresh(refreshToken: string): Promise<{
        access_token: string;
    }>;
    requestPasswordReset(email: string): Promise<string | undefined>;
    resetPasswordWithToken(token: string, newPassword: string): Promise<{
        ok: boolean;
    }>;
    buildEmailVerifyToken(userId: string, email: string): Promise<string>;
    verifyEmailWithToken(token: string): Promise<{
        ok: boolean;
    }>;
}
