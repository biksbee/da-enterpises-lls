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

    // static async initialize(): Promise<void> {
    //     try {
    //         const queries = fs.readFileSync('src/app/database/queries.sql', "utf-8");
    //
    //         const sqlStatements = queries
    //             .split(";")
    //             .map(query => query.trim())
    //             .filter(query => query.length > 0)
    //
    //         for (const query of sqlStatements) {
    //             try {
    //               await this.query(query)
    //               console.log('Table create success')
    //             } catch (error) {
    //                 console.error(`Query ${query} HAS ERROR:\n${error}`)
    //             }
    //         }
    //
    //     } catch (error) {
    //         console.error('Error initializing databases:', error);
    //         throw error;
    //     }
    // }
}