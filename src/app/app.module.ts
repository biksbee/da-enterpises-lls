import {Application} from "express";
import {AuthModule} from "./auth/auth.module";
import {SessionModule} from "./session/session.module";
import {FileStorageModule} from "./file-storage/file-storage.module";

export class AppModule {
    constructor(
        private app: Application,
    ) {
    }

    async init() {
        try {
            new SessionModule(this.app).init();
            new AuthModule(this.app).init();
            new FileStorageModule(this.app).init();

        } catch (error) {
            console.error('Failed to initialize application:', error);
        }
    }
}