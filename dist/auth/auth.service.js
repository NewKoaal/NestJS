"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const mail_service_1 = require("../mail/mail.service");
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
const RESET_TTL = '15m';
function shortChecksum(str) {
    return crypto.createHash('sha256').update(str).digest('hex').slice(0, 16);
}
let AuthService = class AuthService {
    usersService;
    jwtService;
    mailService;
    constructor(usersService, jwtService, mailService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }
    async validateUser(email, pass) {
        const user = await this.usersService.findByEmailWithPassword(email);
        if (user) {
            const ok = await bcrypt.compare(pass, user.password);
            if (!ok)
                throw new common_1.UnauthorizedException('Invalid credentials');
            delete user.password;
            return user;
        }
        return null;
    }
    async login(user) {
        const payload = { email: user.email, sub: user.id };
        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET || 'a',
            expiresIn: '1h',
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET || 'a',
            expiresIn: '7d',
        });
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }
    async refresh(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET || 'a',
            });
            const user = await this.usersService.findByEmailWithPassword(payload.email);
            if (!user)
                throw new common_1.UnauthorizedException();
            const newAccessToken = this.jwtService.sign({ email: user.email, sub: user.id }, { secret: process.env.JWT_SECRET || 'a', expiresIn: '1h' });
            return { access_token: newAccessToken };
        }
        catch (e) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
    }
    async requestPasswordReset(email) {
        const userWithPass = await this.usersService.findByEmailWithPassword(email);
        if (!userWithPass)
            return;
        const passChecksum = shortChecksum(userWithPass.password);
        const token = this.jwtService.sign({
            sub: userWithPass.id,
            email: userWithPass.email,
            prc: passChecksum,
        }, {
            secret: process.env.JWT_RESET_SECRET || 'a',
            expiresIn: RESET_TTL,
            audience: 'password-reset',
            issuer: 'test-app',
        });
        const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        await this.mailService.sendMail(userWithPass.email, 'Reset your password', `<h1>Welcome to EduCollab!</h1>
       <p>Click below to reset your password:</p>
       <a href="${link}" target="_blank">Reset password</a>
       <p>This link will expire in 24 hours.</p>`);
        return token;
    }
    async resetPasswordWithToken(token, newPassword) {
        let payload;
        try {
            payload = this.jwtService.verify(token, {
                secret: process.env.JWT_RESET_SECRET || 'a',
                audience: 'password-reset',
                issuer: 'test-app',
            });
        }
        catch {
            throw new common_1.BadRequestException('Invalid or expired token');
        }
        const userWithPass = await this.usersService.findByIdWithPassword(payload.sub);
        if (!userWithPass)
            throw new common_1.BadRequestException('Invalid token');
        const currentChecksum = shortChecksum(userWithPass.password);
        if (currentChecksum !== payload.prc) {
            throw new common_1.BadRequestException('Invalid or expired token');
        }
        const newHash = await bcrypt.hash(newPassword, 12);
        await this.usersService.updatePassword(userWithPass.id, newHash);
        return { ok: true };
    }
    async verifyEmailWithToken(token) {
        let payload;
        try {
            payload = this.jwtService.verify(token, {
                secret: process.env.JWT_EMAIL_VERIFY_SECRET || 'a',
                audience: 'email-verify',
                issuer: 'test-app',
            });
        }
        catch {
            throw new common_1.BadRequestException('Invalid or expired token');
        }
        await this.usersService.markEmailVerified(payload.sub);
        return { ok: true };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map