import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not defined in environment variables');
    }
    this.resend = new Resend(apiKey);
  }

  async sendMail(to: string, subject: string, html: string) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: 'backendtest <noreply@educolab.com>',
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
      <p>Thank you for joining us</p>`;
    return this.sendMail(to, 'Welcome!', html);
  }

  async sendCoursePublishedNotification(to: string, courseTitle: string) {
    const html = `<h1>New Course Published!</h1>
      <p>Your course <b>${courseTitle}</b> is now live</p>`;
    return this.sendMail(to, `Course "${courseTitle}" Published`, html);
  }
}
