import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private readonly mailService;
    constructor(usersService: UsersService, jwtService: JwtService, mailService: MailService);
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
    verifyEmailWithToken(token: string): Promise<{
        ok: boolean;
    }>;
}
