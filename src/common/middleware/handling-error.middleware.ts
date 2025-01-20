import {HttpException} from "../exceptions/http-exception.middleware";
import {NextFunction, Request, Response} from "express";

export const HandlingErrorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof HttpException) {
        return res.status(err.status).json({ message: err.message })
    }
    return res.status(500).json({message: 'Unknown error'})
}