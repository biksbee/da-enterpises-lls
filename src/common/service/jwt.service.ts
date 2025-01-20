import jwt from 'jsonwebtoken'

export class JwtService {

    sign(payload: {id: string}, option: {secret: string, expiresIn: string}): string {
        return jwt.sign(payload, option.secret, { expiresIn: option.expiresIn})
    }

    verify<T>(token: string, secret: string): T {
        try {
            return jwt.verify(token, secret) as T;
        } catch (error) {
            throw new Error('Invalid token')
        }
    }
}