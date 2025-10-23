import { Strategy } from 'passport-jwt';
import { Request } from 'express';
declare const JwtRefreshStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtRefreshStrategy extends JwtRefreshStrategy_base {
    constructor();
    validate(req: Request, payload: any): Promise<{
        userId: any;
        email: any;
        refreshToken: any;
    }>;
}
export {};
