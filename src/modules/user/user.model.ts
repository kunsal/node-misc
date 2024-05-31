import {DataTypes, Model, Sequelize} from 'sequelize';
import sequelize from '../../config/database';
import Role from '../role/role.model';
import { AllowNull } from 'sequelize-typescript';
// import bcrypt from 'bcrypt';

export interface IUser {
    id: number,
    name: string,
    email: string,
    roleId?: number,
    password?: string,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date,
}

export interface IUserRegistration extends IUser {}

class User extends Model<IUserRegistration> {}

User.init({
    id: {
        type: DataTypes.NUMBER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }, 
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }, 
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
    
}, {
    sequelize,
    timestamps: true,
    paranoid: true
});
User.belongsTo(Role, {
    foreignKey: 'roleId',
    as: 'role'
});
User.sync({alter: true});

export default User;