import {DataTypes, Model} from 'sequelize';
import sequelize from '../../config/database';

export interface IAuth {
    id: number,
    token: string,
    refreshToken: string,
    expiresAt: Date
}

class AuthModel extends Model<IAuth> {}

AuthModel.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false
    },
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    paranoid: true,
    tableName: 'Auth',
    timestamps: true
}).sync();

export default AuthModel;