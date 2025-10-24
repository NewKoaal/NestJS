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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_service_1 = require("./app.service");
let AppController = class AppController {
    appService;
    configService;
    constructor(appService, configService) {
        this.appService = appService;
        this.configService = configService;
    }
    getHello() {
        return this.appService.getHello();
    }
    getEnvTest() {
        return {
            postgresHost: this.configService.get('POSTGRES_HOST'),
            postgresPort: this.configService.get('POSTGRES_PORT'),
            postgresUser: this.configService.get('POSTGRES_USER'),
            postgresDatabase: this.configService.get('POSTGRES_DATABASE'),
            jwtSecret: this.configService.get('JWT_SECRET') ? 'Set' : 'Not set',
            resendApiKey: this.configService.get('RESEND_API_KEY') ? 'Set' : 'Not set',
            nodeEnv: this.configService.get('NODE_ENV'),
        };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('env-test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getEnvTest", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        config_1.ConfigService])
], AppController);
//# sourceMappingURL=app.controller.js.map