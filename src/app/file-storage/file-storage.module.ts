import {Application} from "express";
import {FileStorageController} from "./file-storage.controller";
import {FileStorageService} from "./file-storage.service";
import * as fs from "node:fs";
import path from "path";


export class FileStorageModule {
    constructor(
        private app: Application
    ) {
    }

    init() {
        const uploadDir = path.join(__dirname, '../../../uploads'); // Путь к папке
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
            console.log(`Directory ${uploadDir} created.`);
        }

        const fileStorageService = new FileStorageService();
        const fileStorageController = new FileStorageController(fileStorageService);
        this.app.use('/file', fileStorageController.router)
    }
}