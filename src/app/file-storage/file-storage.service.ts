import {NextFunction} from "express";
import * as path from "node:path";
import {HttpException} from "../../common/exceptions/http-exception.middleware";
import * as fs from "node:fs";
import {FileStorageModel} from "./file-storage.model";

export class FileStorageService {
    private readonly storagePath = path.resolve(__dirname, '../../../uploads');

    constructor() {
    }

    async getById(id: number, next: NextFunction) {
        if (!id) {
            return next(HttpException.badRequestException('Invalid Id value'))
        }
        const file = await FileStorageModel.findByPk(id);

        if(!file) {
            return next(HttpException.notFoundException('File not found'))
        }

        return file
    }

    async download(id: number, next: NextFunction) {
        const file = await this.getById(id, next);
        const filePath = file['path'];

        if (!fs.existsSync(filePath)) {
            return next(HttpException.notFoundException('File not found on the server'))
        }

        return filePath;
    }

    async getByFilePath(path: string, next: NextFunction) {
        return await FileStorageModel.findOne({ where: {path}})
    }

    async upload(file: Express.Multer.File, { id: userId }: {id: string}, next: NextFunction) {
        const filePath = path.join(this.storagePath, file.filename);
        await FileStorageModel.create({
            name: file.originalname,
            extension: path.extname(file.originalname),
            mimeType: file.mimetype,
            size: file.size,
            uploadDate: new Date(),
            filename: file.filename,
            path: filePath,
            userId
        })
        return await this.getByFilePath(filePath, next)
    }

    async list(data: { count: number, page: number }, next: NextFunction) {
        return await FileStorageModel.findAndCountAll({
            limit: data.count,
            offset: data.page
        });
    }
    
    async update(id: number, file: Express.Multer.File, { id: userId }: { id: string}, next: NextFunction) {
        const currentFile = await this.getById(id, next);
        fs.unlinkSync(currentFile['path'])
        const filePath = path.join(this.storagePath, file.filename);
        const newFile = await FileStorageModel.findByPk(id);
        await newFile.update({
            name: file.originalname,
            extension: path.extname(file.originalname),
            mimeType: file.mimetype,
            size: file.size,
            uploadDate: new Date(),
            filename: file.filename,
            path: filePath,
            userId
        })
        return await this.getById(id, next)
    }

    async delete(id: number, next: NextFunction) {
        const file = await this.getById(id, next);
        fs.unlinkSync(file['path'])
        await FileStorageModel.destroy({where: {id}})
        return { success: true }
    }
}