import {Column, DataType, HasMany, Model, Table} from "sequelize-typescript";
import {SessionModel} from "../session/models/session.model";


@Table({
    timestamps: false,
    tableName: 'users',
    modelName: 'users'
})
export class UsersModel extends Model {
    @Column({
        primaryKey: true,
        type: DataType.STRING,
        allowNull: false
    })
    id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    password: string;

    @HasMany(() => SessionModel)
    sessions: SessionModel[]

    @HasMany(() => SessionModel)
    files: SessionModel[]
}