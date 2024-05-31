import {DataTypes, Model, Sequelize} from 'sequelize';
import sequelize from '../../config/database';
import User from '../user/user.model';

export interface IRole {
    id: number;
    name: string;
    permissions?: string;
}

class Role extends Model<IRole> {}

Role.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },  
    permissions: {
        type: DataTypes.STRING,
        allowNull: true
    }
    
}, {
    sequelize,
    timestamps: false,
    paranoid: true
});

// Role.hasMany(User, {
//     foreignKey: 'roleId'
// });

Role.sync({alter: true});

export default Role;