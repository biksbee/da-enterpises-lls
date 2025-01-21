import mysql, {Pool, ResultSetHeader, RowDataPacket} from "mysql2/promise";
import * as process from "node:process";
import * as path from "node:path";
import * as fs from "node:fs";

export class DatabaseModule {
    private static pool: Pool;

    static connect(): Pool {
        if (!this.pool) {
            this.pool = mysql.createPool({
                host: process.env.DATABASE_HOST,
                user: process.env.DATABASE_USER,
                password: process.env.DATABASE_PASSWORD,
                database: process.env.DATABASE_NAME,
                port: Number(process.env.DATABASE_PORT),
                waitForConnections: true,
                connectionLimit: 10
            });

            console.log('Database connection')

        }

        return this.pool
    }

    static async query<T extends RowDataPacket[] | ResultSetHeader>(
        sql: string,
        params?: any[]
    ): Promise<T> {
        const pool = this.connect();
        try {
            const [rows] = await pool.query<T>(sql, params);
            return rows;
        } catch (error) {
            console.error('Database query error:', error);
            throw error;
        }
    }

    static async initialize(): Promise<void> {
        try {
            const queries = fs.readFileSync('src/app/database/queries.sql', "utf-8");

            const sqlStatements = queries
                .split(";")
                .map(query => query.trim())
                .filter(query => query.length > 0)

            for (const query of sqlStatements) {
                try {
                  await this.query(query)
                  console.log('Table create success')
                } catch (error) {
                    console.error(`Query ${query} HAS ERROR:\n${error}`)
                }
            }

        } catch (error) {
            console.error('Error initializing databases:', error);
            throw error;
        }
    }
}