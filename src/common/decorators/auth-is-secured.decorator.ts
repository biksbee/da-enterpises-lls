import 'reflect-metadata';

export const IS_SECURED_KEY = 'isSecured';

export const IsSecured = (value: boolean = true): MethodDecorator  => {
    return (target, propertyKey) => {
        Reflect.defineMetadata(IS_SECURED_KEY, value, target, propertyKey);
    }
}