import {NextFunction, Request, Response, Router} from "express";
import {registerRoutes} from "../../common/utils/route.utils";
import {FileStorageService} from "./file-storage.service";
import {Delete, Get, Post, Put} from "../../common/decorators/method.decorators";
import {upload} from "../../common/middleware/multer.middleware";

export class FileStorageController {
    public router: Router;

    constructor(
        private fileStorageService: FileStorageService
    ) {
        this.router = Router();
        registerRoutes(this, this.router)
    }

    @Get('/list', false)
    async list(req: Request, res: Response, next: NextFunction) {
        const count = Number(req.query.list_size as string) || 10;
        const page = Number(req.query.page as string) || 1;
        return res
            .status(200)
            .json(await this.fileStorageService.list({count, page}, next))
    }

    @Get('/download/:id', false)
    async download(req: Request, res: Response, next: NextFunction) {
        return res
            .status(200)
            .json(await this.fileStorageService.download(Number(req.params.id), next))
    }

    @Get('/:id', false)
    async get(req: Request, res: Response, next: NextFunction) {
        return res
            .status(200)
            .json(await this.fileStorageService.getById(Number(req.params.id), next))
    }

    @Post('/upload', true, [upload.single('file')])
    async upload(req: Request, res: Response, next: NextFunction) {
        const { file } = req
        return res
            .status(201)
            .json(await this.fileStorageService.upload(file, req['parsedToken'], next))
    }

    @Put('/update/:id', true, [upload.single('file')])
    async update(req: Request, res: Response, next: NextFunction) {
        const { file } = req;
        return res
            .status(201)
            .json(await this.fileStorageService.update(Number(req.params.id), file, req['parsedToken'], next))
    }

    @Delete('/delete/:id', true)
    async delete(req: Request, res: Response, next: NextFunction) {
        return res
            .status(200)
            .json(await this.fileStorageService.delete(Number(req.params.id), next))
    }

}