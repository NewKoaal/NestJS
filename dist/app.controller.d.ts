import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    private readonly configService;
    constructor(appService: AppService, configService: ConfigService);
    getHello(): string;
    getEnvTest(): {
        postgresHost: string | undefined;
        postgresPort: number | undefined;
        postgresUser: string | undefined;
        postgresDatabase: string | undefined;
        jwtSecret: string;
        resendApiKey: string;
        nodeEnv: string | undefined;
    };
}
