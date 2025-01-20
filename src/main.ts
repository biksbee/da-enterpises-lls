import express, {Application} from 'express';
import 'dotenv/config';
import {AppModule} from "./app/app.module";
import cors from 'cors'
import {DatabaseModule} from "./app/database/database.module";
import * as process from "node:process";
import {FingerprintMiddleware} from "./common/middleware/fingerprint.middleware";
import {HandlingErrorMiddleware} from "./common/middleware/handling-error.middleware";
import {AuthGuard} from "./common/guards/auth.guard";

const port = process.env.PORT || 3502

const main: Application = express();

(async () => {
    try {
        main.use(cors());
        main.use(express.json());
        main.use(FingerprintMiddleware);

        const authGuard = new AuthGuard();
        main.use((req, res, next) => authGuard.use(req, res, next));

        await DatabaseModule.initialize();
        await new AppModule(main).init();

        main.use('/uploads', express.static('/uploads'))
        main.use(HandlingErrorMiddleware)

        main.listen(port, () => {
            console.log(`Server listening on port ${port}`)
        })
    } catch (error) {
        console.error("Application failed to start:", error);
    }
})();
