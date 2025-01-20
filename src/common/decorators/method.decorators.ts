import 'reflect-metadata';
import {IS_SECURED_KEY} from "./auth-is-secured.decorator";

const methodDecorator = (method: string) => {
    return (path: string, isSecured: boolean = false, middlewares: Array<Function> = []): MethodDecorator => {
        return (target, propertyKey, descriptor) => {
            Reflect.defineMetadata('path', path, target, propertyKey);
            Reflect.defineMetadata('method', method, target, propertyKey);
            Reflect.defineMetadata('middlewares', middlewares, target, propertyKey);
            // Reflect.defineMetadata(IS_SECURED_KEY, isSecured, target, propertyKey);
            return descriptor;
        };
    };
}

export const Get = methodDecorator('get');
export const Post = methodDecorator('post');
export const Patch = methodDecorator('patch');
export const Put = methodDecorator('put');
export const Delete = methodDecorator('delete');