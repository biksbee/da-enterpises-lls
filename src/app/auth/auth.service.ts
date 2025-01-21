import dcrypt from 'bcrypt'
import {AuthResponse, UserResponse} from "./auth.response";
import {AuthType} from "./auth.type";
import * as process from "node:process";
import {PROVIDERS_TYPE} from "../../common/constants";
import {SessionService} from "../session/session.service";
import {JwtService} from "../../common/service/jwt.service";
import {HttpException} from "../../common/exceptions/http-exception.middleware";
import {NextFunction} from "express";
import Moment from "moment";
import {UsersModel} from "./users.model";

export class AuthService {
    constructor(
        private sessionService: SessionService,
        private jwtService: JwtService
    ) {
    }

    async getById(id: string): Promise<UserResponse> {
        return await UsersModel.findOne({where: {id}})
    }

    async generateToken(payload: { id: string }, expiresIn: string) {
        const secret = process.env.TOKEN_SECRET;
        return this.jwtService.sign(
            payload, {
                secret,
                expiresIn
            }
        )
    }

    async get(id: string, fingerprint: string, next?: NextFunction): Promise<AuthResponse> {
        const accessTokenLifeTime = process.env.TOKEN_LIFE_TIME;
        const provider = await this.sessionService.getProvider(PROVIDERS_TYPE.REFRESH)
        const refreshToken = await this.generateToken({id}, provider['lifetime'])
        await this.sessionService.create({
            token: refreshToken,
            providerId: PROVIDERS_TYPE.REFRESH,
            fingerprint,
            userId: id
        })
        const accessToken = await this.generateToken({id}, accessTokenLifeTime)
        return {
            accessToken,
            refreshToken
        }
    }

    async login(data: AuthType, fingerprint: string, next: NextFunction) {
        const user = await this.getById(data.id);
        if (!user) {
            return next(HttpException.notFoundException(`User with ID ${data.id} not found`));
        }
        const match = await dcrypt.compare(data.password, user.password);
        if (!match) {
            return next(HttpException.badRequestException())
        }
        await this.sessionService.deleteSame({
            providerId: PROVIDERS_TYPE.REFRESH,
            fingerprint,
            userId: user.id
        })
        return this.get(user.id, fingerprint)
    }

    async refresh(data: {refreshToken: string}, fingerprint: string, next?: NextFunction) {
        const secret = process.env.TOKEN_SECRET;
        const jwtData = this.jwtService.verify<{id: string}>(data.refreshToken, secret)
        const user = await this.getById(jwtData.id)
        const token = await this.sessionService.getByToken({
            token: data.refreshToken,
            providerId: PROVIDERS_TYPE.REFRESH
        });
        if (!token) {
            return next(HttpException.unauthorizedException('Invalid refresh token'))
        }
        if (Moment().isSameOrAfter(token['expiresAt'])) {
            return next(HttpException.unauthorizedException('Refresh token was expired'))
        }
        await this.sessionService.delete(token['id']);
        return this.get(user.id, fingerprint)
    }

    async create(data: AuthType, fingerprint: string, next: NextFunction) {
        const candidate = await this.getById(data.id)
        if (candidate) {
            return next(HttpException.badRequestException())
        }
        const passwordHash = await dcrypt.hash(data.password, 10)
        await UsersModel.create({
            id: data.id,
            password: passwordHash
        })
        return await this.get(data.id, fingerprint)
    }

    async info({id}: { id: string }, next: NextFunction) {
        return {id}
    }

    async logout({id}: { id: string }, fingerprint: string, next: NextFunction) {
        await this.sessionService.deleteSame({
            providerId: PROVIDERS_TYPE.REFRESH,
            fingerprint,
            userId: id
        })
        return {success: true}
    }
}