import {NextFunction, Request, Response, Router} from "express";
import {IS_SECURED_KEY} from "../decorators/auth-is-secured.decorator";

export const registerRoutes = (instance: any, router: Router) => {
    const prototype = Object.getPrototypeOf(instance);

    Object.getOwnPropertyNames(prototype).forEach((methodName) => {
        const routeHandler = prototype[methodName];
        const path = Reflect.getMetadata('path', prototype, methodName);
        const method = Reflect.getMetadata('method', prototype, methodName)
        // const isSecured = Reflect.getMetadata(IS_SECURED_KEY, prototype, methodName)
        const middlewares = Reflect.getMetadata('middlewares', prototype, methodName) || [];

        if (path && method) {
            router[method](path, ...middlewares, routeHandler.bind(instance))
        }

        // if (path && method) {
        //     router[method](path, async (req: Request, res: Response, next: NextFunction) => {
        //         req['isSecured'] = isSecured ?? false;
        //
        //         try {
        //             await routeHandler.call(instance, req, res, next);
        //         } catch (error) {
        //             next(error);
        //         }
        //     });
        // }
    });
}


