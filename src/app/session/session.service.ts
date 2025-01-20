import {DatabaseModule} from "../database/database.module";
import {SessionCreateType, SessionDeleteSameType, SessionGetByTokenType} from "./session.types";
import CryptoJS from 'crypto-js';
import Moment from 'moment';
import ms from "ms";



export class SessionService {
    async getProvider(id: number) {
        return await DatabaseModule.query(
            `SELECT * FROM providers WHERE id = ?`,
            [id]
        )
    }
    async create(data: SessionCreateType) {
        const secret = process.env.REFRESH_TOKEN_SECRET
        //@ts-ignore
        const [provider] = await this.getProvider(data.providerId);
        data.token = CryptoJS
            .HmacSHA512(data.token, secret)
            .toString(CryptoJS.enc.Base64)
        const lifetime = provider.lifetime ? ms(provider.lifetime) : null
        const expiresAt = provider.lifetime ? Moment().add(lifetime, 'ms').toDate() : null
        const fingerprint = data.fingerprint
            ? CryptoJS
                .SHA512(data.fingerprint)
                .toString(CryptoJS.enc.Base64)
            : null
        return DatabaseModule.query(
            `
                    INSERT INTO sessions (providerId, fingerprint, expiresAt, userId, token)
                    VALUES (?, ?, ?, ?, ?)
            `, [provider.id, fingerprint, expiresAt, data.userId, data.token]
        )
    }

    async delete(id: number) {
        return await DatabaseModule.query(
            `DELETE FROM sessions WHERE id = ?`,
            [id]
        )
    }

    async getByToken(data: SessionGetByTokenType) {
        const secret = process.env.REFRESH_TOKEN_SECRET;
        data.token = CryptoJS
            .HmacSHA512(data.token, secret)
            .toString(CryptoJS.enc.Base64)
        return await DatabaseModule.query(`
            SELECT * FROM sessions WHERE token = ? AND providerId = ? 
            LIMIT 1
            `, [data.token, data.providerId]
        )
    }

    async deleteSame(data: SessionDeleteSameType) {
        const fingerprint = data.fingerprint
            ? CryptoJS
                .SHA512(data.fingerprint)
                .toString(CryptoJS.enc.Base64)
            : null
        return await DatabaseModule.query(
            `DELETE FROM sessions WHERE userId = ? AND providerId = ? AND fingerprint = ?`,
            [data.userId, data.providerId, fingerprint]
        )
    }
}