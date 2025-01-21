import * as process from "node:process";
import {Sequelize} from "sequelize-typescript";
import {UsersModel} from "../auth/users.model";
import {SessionModel} from "../session/models/session.model";
import {ProviderModel} from "../session/models/provider.model";
import {FileStorageModel} from "../file-storage/file-storage.model";


export class DatabaseModule {

    static connect(): Sequelize {
        return new Sequelize({
            dialect: "mysql",
            host: process.env.DATABASE_HOST,
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            logging: false,
            models: [UsersModel, SessionModel, ProviderModel, FileStorageModel]
        })
    }
}