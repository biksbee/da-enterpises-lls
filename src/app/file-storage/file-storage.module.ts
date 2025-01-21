import {Application, NextFunction, Request, Response} from "express";
import {FileStorageController} from "./file-storage.controller";
import {FileStorageService} from "./file-storage.service";
import * as fs from "node:fs";
import path from "path";
import {DatabaseModule} from "../database/database.module";
import {HttpException} from "../../common/exceptions/http-exception.middleware";


export class FileStorageModule {
    constructor(
        private app: Application
    ) {
    }

    init() {
        const uploadDir = path.join(__dirname, '../../../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
            console.log(`Directory ${uploadDir} created.`);
        }

        const fileStorageService = new FileStorageService();
        const fileStorageController = new FileStorageController(fileStorageService);

        this.app.get('/upload/:id', async (req: Request, res: Response, next: NextFunction) => {
            const id = Number(req.params.id);
            //@ts-ignore
            const [file] = await DatabaseModule.query(
                `SELECT * FROM files WHERE id = ?`,
                [id]
            )
            if (file) {
                const filePath = path.join(`${uploadDir}`, `${file.filename}`);
                res.sendFile(filePath)
            } else {
                next(HttpException.notFoundException('File not found'))
            }
        })

        this.app.use('/file', fileStorageController.router)
    }
}