import express, {Application} from 'express';
import 'dotenv/config';
import {AppModule} from "./app/app.module";
import cors from 'cors'
import {DatabaseModule} from "./app/database/database.module";
import * as process from "node:process";
import {FingerprintMiddleware} from "./common/middleware/fingerprint.middleware";
import {HandlingErrorMiddleware} from "./common/middleware/handling-error.middleware";
import {AuthGuard} from "./common/guards/auth.guard";
import path from "path";
import helmet from "helmet";

const port = process.env.PORT || 3502

const main: Application = express();

(async () => {
    try {
        main.use(cors());
        main.use(express.json());
        main.use(helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"], // Разрешить ресурсы с того же домена
                    imgSrc: ["'self'", "data:"], // Разрешить изображения с того же домена и в формате data URI
                },
            },
        }));
        main.use((req, res, next) => {
            res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data:;");
            next();
        });
        main.use(FingerprintMiddleware);
        main.use('/upload', express.static(path.resolve(__dirname, '/uploads')));

        const authGuard = new AuthGuard();
        main.use((req, res, next) => authGuard.use(req, res, next));

        await DatabaseModule.initialize();
        await new AppModule(main).init();

        main.use(HandlingErrorMiddleware)

        main.listen(port, () => {
            console.log(`Server listening on port ${port}`)
        })
    } catch (error) {
        console.error("Application failed to start:", error);
    }
})();
