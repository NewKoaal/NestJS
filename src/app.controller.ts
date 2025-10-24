import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('env-test')
  getEnvTest() {
    return {
      postgresHost: this.configService.get<string>('POSTGRES_HOST'),
      postgresPort: this.configService.get<number>('POSTGRES_PORT'),
      postgresUser: this.configService.get<string>('POSTGRES_USER'),
      postgresDatabase: this.configService.get<string>('POSTGRES_DATABASE'),
      jwtSecret: this.configService.get<string>('JWT_SECRET') ? 'Set' : 'Not set',
      resendApiKey: this.configService.get<string>('RESEND_API_KEY') ? 'Set' : 'Not set',
      nodeEnv: this.configService.get<string>('NODE_ENV'),
    };
  }
}
