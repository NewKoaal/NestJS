import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY || 're_4NvE52L2_FzYFTJTJvuF92dC3Z6yeuAEg');
  }

  async sendMail(to: string, subject: string, html: string) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: 'backendtest <noreply@yourdomain.com>',
        to,
        subject,
        html,
      });
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Email sending failed:', err);
      throw new InternalServerErrorException('Could not send email');
    }
  }

  async sendWelcomeEmail(to: string, username: string) {
    const html = `<h1>Welcome, ${username}!</h1>
      <p>Thank you for joining us 🎓</p>`;
    return this.sendMail(to, 'Welcome!', html);
  }

  async sendCoursePublishedNotification(to: string, courseTitle: string) {
    const html = `<h1>New Course Published!</h1>
      <p>Your course <b>${courseTitle}</b> is now live</p>`;
    return this.sendMail(to, `Course "${courseTitle}" Published`, html);
  }
}
