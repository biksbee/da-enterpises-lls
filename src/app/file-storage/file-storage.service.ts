import {NextFunction} from "express";
import * as path from "node:path";
import {DatabaseModule} from "../database/database.module";
import {HttpException} from "../../common/exceptions/http-exception.middleware";
import * as fs from "node:fs";

export class FileStorageService {
    private readonly storagePath = path.resolve(__dirname, '../../../uploads');

    constructor() {
    }

    async getById(id: number, next: NextFunction) {
        if (!id) {
            next(HttpException.badRequestException('Invalid Id value'))
        }
        //@ts-ignore
        const [file] = await DatabaseModule.query(
            `SELECT * FROM files WHERE id = ?`,
            [id]
        )

        if(!file) {
            next(HttpException.notFoundException('File not found'))
        }

        return file
    }

    async download(id: number, next: NextFunction) {
        const file = await this.getById(id, next);
        const filePath = file.path;

        if (!fs.existsSync(filePath)) {
            next(HttpException.notFoundException('File not found on the server'))
        }

        return filePath;
    }

    async getByFilePath(path: string, next: NextFunction) {
        return await DatabaseModule.query(`SELECT * FROM files WHERE path = ?`, [path])
    }

    async upload(file: Express.Multer.File, { id: userId }: {id: string}, next: NextFunction) {
        const filePath = path.join(this.storagePath, file.filename);
        await DatabaseModule.query(`
            INSERT INTO files (name, extension, mimeType, size, uploadDate,fileName, path, userId) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [file.originalname, path.extname(file.originalname), file.mimetype, file.size, new Date(), file.filename, filePath, userId])
        return await this.getByFilePath(filePath, next)
    }

    async list(data: { count: number, page: number }, next: NextFunction) {
        //@ts-ignore
        const [{count}] = await DatabaseModule.query(`SELECT COUNT(*) AS count FROM files`)
        return {
            rows: await DatabaseModule.query(`
                SELECT * FROM files LIMIT ? OFFSET ?
            `, [data.count, data.page]),
            count
        }
    }
    
    async update(id: number, file: Express.Multer.File, { id: userId }: { id: string}, next: NextFunction) {
        const currentFile = await this.getById(id, next);
        fs.unlinkSync(currentFile.path)
        const filePath = path.join(this.storagePath, file.filename);
        await DatabaseModule.query(`
            UPDATE files SET name = ?, extension = ?, mimeType = ?, size = ?, uploadDate = ?, path = ?, userId = ? WHERE id = ?
        `, [file.originalname, path.extname(file.originalname), file.mimetype, file.size, new Date(), filePath, userId, id])
        return await this.getById(id, next)
    }

    async delete(id: number, next: NextFunction) {
        //@ts-ignore
        const file = await this.getById(id);
        fs.unlinkSync(file.path)
        await DatabaseModule.query(`DELETE FROM files WHERE id = ?`, [id])
        return { success: true }
    }
}