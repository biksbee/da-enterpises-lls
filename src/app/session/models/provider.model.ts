import {Column, DataType, HasMany, Model, Table} from "sequelize-typescript";
import {SessionModel} from "./session.model";

@Table({
    timestamps: false,
    tableName: 'providers',
    modelName: 'providers'
})
export class ProviderModel extends Model {
    @Column({
        autoIncrement: true,
        primaryKey: true,
        type: DataType.INTEGER
    })
    id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    lifetime: string;

    @HasMany(() => SessionModel)
    sessions: SessionModel[]
}