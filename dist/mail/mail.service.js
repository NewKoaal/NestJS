"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const resend_1 = require("resend");
let MailService = class MailService {
    resend;
    constructor() {
        this.resend = new resend_1.Resend(process.env.RESEND_API_KEY || 're_4NvE52L2_FzYFTJTJvuF92dC3Z6yeuAEg');
    }
    async sendMail(to, subject, html) {
        try {
            const { data, error } = await this.resend.emails.send({
                from: 'backendtest <noreply@yourdomain.com>',
                to,
                subject,
                html,
            });
            if (error)
                throw error;
            return data;
        }
        catch (err) {
            console.error('Email sending failed:', err);
            throw new common_1.InternalServerErrorException('Could not send email');
        }
    }
    async sendWelcomeEmail(to, username) {
        const html = `<h1>Welcome, ${username}!</h1>
      <p>Thank you for joining us 🎓</p>`;
        return this.sendMail(to, 'Welcome!', html);
    }
    async sendCoursePublishedNotification(to, courseTitle) {
        const html = `<h1>New Course Published!</h1>
      <p>Your course <b>${courseTitle}</b> is now live</p>`;
        return this.sendMail(to, `Course "${courseTitle}" Published`, html);
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MailService);
//# sourceMappingURL=mail.service.js.map