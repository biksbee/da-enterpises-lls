import {Application} from "express";
import {SessionService} from "./session.service";

export class SessionModule {
    constructor(
        private app: Application,
    ) {
    }

    init() {
    }

    static sessionService = new SessionService();
}