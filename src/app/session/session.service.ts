import {DatabaseModule} from "../database/database.module";
import {SessionCreateType, SessionDeleteSameType, SessionGetByTokenType} from "./session.types";
import CryptoJS from 'crypto-js';
import Moment from 'moment';
import ms from "ms";
import {ProviderModel} from "./models/provider.model";
import {SessionModel} from "./models/session.model";



export class SessionService {
    async getProvider(id: number) {
        return await ProviderModel.findByPk(id)
    }
    async create(data: SessionCreateType) {
        const secret = process.env.REFRESH_TOKEN_SECRET
        const provider = await this.getProvider(data.providerId);
        data.token = CryptoJS
            .HmacSHA512(data.token, secret)
            .toString(CryptoJS.enc.Base64)
        const lf = provider.lifetime as ms.StringValue
        const lifetime = provider.lifetime ? ms(lf) : null
        const expiresAt = provider.lifetime ? Moment().add(lifetime, 'ms').toDate() : null
        const fingerprint = data.fingerprint
            ? CryptoJS
                .SHA512(data.fingerprint)
                .toString(CryptoJS.enc.Base64)
            : null
        return await SessionModel.create({
            providerId: provider.id,
            fingerprint,
            expiresAt,
            userId: data.userId,
            token: data.token
        })
    }

    async delete(id: number) {
        return await SessionModel.destroy({ where: {id}})
    }

    async getByToken(data: SessionGetByTokenType) {
        const secret = process.env.REFRESH_TOKEN_SECRET;
        data.token = CryptoJS
            .HmacSHA512(data.token, secret)
            .toString(CryptoJS.enc.Base64)
        return await SessionModel.findOne({
            where: {
                token: data.token,
                providerId: data.providerId
            }
        })
    }

    async deleteSame(data: SessionDeleteSameType) {
        const fingerprint = data.fingerprint
            ? CryptoJS
                .SHA512(data.fingerprint)
                .toString(CryptoJS.enc.Base64)
            : null
        return await SessionModel.destroy({
            where: {
                userId: data.userId,
                providerId: data.providerId,
                fingerprint
            }
        })
    }
}