import {NextFunction, Request, Response, Router} from "express";
import {AuthService} from "./auth.service";
import {registerRoutes} from "../../common/utils/route.utils";
import {Get, Post} from "../../common/decorators/method.decorators";

export class AuthController {
    public router: Router;

    constructor(
        private authService: AuthService
    ) {
        this.router = Router();
        registerRoutes(this, this.router);
    }

    @Get('/info', true)
    async info(req: Request, res: Response, next: NextFunction) {
        return res
            .status(200)
            .json(await this.authService.info(req['parsedToken'], next))
    }

    @Post('/signin')
    async signIn(req: Request, res: Response, next: NextFunction) {
        return res
            .status(200)
            .json(await this.authService.login(req.body, req.fingerprint.hash, next));
    }

    @Post('/signin/new_token')
    async signInNewToken(req: Request, res: Response, next: NextFunction) {
        return res
            .status(201)
            .json(await this.authService.refresh(req.body, req.fingerprint.hash, next));
    }

    @Post('/singup')
    async singUp(req: Request, res: Response, next: NextFunction) {
        return res
            .status(201)
            .json(await this.authService.create(req.body, req.fingerprint.hash, next))
    }

    // TODO мб добавить сессии поле active которое будет становиться false после logout
    @Get('/logout/', true)
    async logout(req: Request, res: Response, next: NextFunction) {
        return res
            .status(200)
            .json(await this.authService.logout(req['parsedToken'], req.fingerprint.hash, next))
    }
}