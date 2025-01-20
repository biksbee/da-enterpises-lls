import {JwtService} from "../service/jwt.service";
import {NextFunction, Request, Response} from "express";
import {HttpException} from "../exceptions/http-exception.middleware";
import * as process from "node:process";
import 'reflect-metadata';
import {IS_SECURED_KEY} from "../decorators/auth-is-secured.decorator";




export class AuthGuard {
    private readonly jwtService: JwtService;

    constructor() {
        this.jwtService = new JwtService();
    }

    use(req: Request, res: Response, next: NextFunction) {
        const isSecured = Number(req.headers['secured']);
        if (!isSecured) {
            return next();
        }

        const token = req.headers['auth-access-token'] as string;

        if (!token) {
            return next(HttpException.unauthorizedException('Authorization token is missing'))
        }

        try {
            const secret = process.env.TOKEN_SECRET;
            req['parsedToken'] = this.jwtService.verify(token, secret)
            next();
        } catch (error) {
            return next(HttpException.unauthorizedException('Invalid or expired token'))
        }
    }
}