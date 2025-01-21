import {BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {UsersModel} from "../auth/users.model";


@Table({
    timestamps: false,
    tableName: 'files',
    modelName: 'files'
})
export class FileStorageModel extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
    extension: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    mimeType: string;

    @Column({
        type: DataType.BIGINT,
        allowNull: false
    })
    size: number;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    uploadDate: Date;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    path: string;

    @Column({
        type: DataType.STRING,
    })
    filename: string;

    @ForeignKey(() => UsersModel)
    @Column({ type: DataType.INTEGER, allowNull: false })
    userId: number;

    @BelongsTo(() => UsersModel)
    user: UsersModel
}