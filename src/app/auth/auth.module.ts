import {Application} from "express";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {SessionModule} from "../session/session.module";
import {JwtService} from "../../common/service/jwt.service";

export class AuthModule {
    constructor(
        private app: Application
    ) {
    }

    init() {
        const authService = new AuthService(
            SessionModule.sessionService,
            new JwtService()
        );
        const authController = new AuthController(authService);
        this.app.use('/auth', authController.router);
    }
}