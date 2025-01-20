export class HttpException extends Error {
    public status: number;
    constructor(status: number, message: string) {
        super();
        this.status = status;
        this.message = message;
    }

    static notFoundException(message: string = 'Not Found') {
        return new HttpException(404, message)
    }

    static unauthorizedException(message: string = 'Unauthorized') {
        return new HttpException(401, message)
    }

    static badRequestException(message: string = 'Invalid authentication value') {
        return new HttpException(400, message)
    }

    static internalException(message: string = 'Internal Server Error ') {
        return new HttpException(500, message)
    }
}