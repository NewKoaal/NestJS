export declare class MailService {
    private resend;
    constructor();
    sendMail(to: string, subject: string, html: string): Promise<import("resend").CreateEmailResponseSuccess>;
    sendWelcomeEmail(to: string, username: string): Promise<import("resend").CreateEmailResponseSuccess>;
    sendCoursePublishedNotification(to: string, courseTitle: string): Promise<import("resend").CreateEmailResponseSuccess>;
}
