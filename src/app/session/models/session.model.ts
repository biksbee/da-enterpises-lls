import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {UsersModel} from "../../auth/users.model";
import {ProviderModel} from "./provider.model";

@Table({
    timestamps: false,
    tableName: 'sessions',
    modelName: 'sessions'
})
export class SessionModel extends Model {
    @Column({
        primaryKey: true,
        type: DataType.NUMBER
    })
    id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    fingerprint: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    token: string;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    expiresAt: Date;

    @ForeignKey(() => UsersModel)
    @Column({type: DataType.INTEGER, allowNull: false, onDelete: 'CASCADE'})
    userId: number;

    @ForeignKey(() => ProviderModel)
    @Column({type: DataType.INTEGER, allowNull: false, onDelete: 'RESTRICT'})
    providerId: number;

    @BelongsTo(() => UsersModel)
    user: UsersModel;

    @BelongsTo(() => ProviderModel)
    provider: ProviderModel;
}