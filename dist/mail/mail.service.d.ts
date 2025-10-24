import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private configService;
    private resend;
    constructor(configService: ConfigService);
    sendMail(to: string, subject: string, html: string): Promise<import("resend").CreateEmailResponseSuccess>;
    sendWelcomeEmail(to: string, username: string): Promise<import("resend").CreateEmailResponseSuccess>;
    sendCoursePublishedNotification(to: string, courseTitle: string): Promise<import("resend").CreateEmailResponseSuccess>;
}
