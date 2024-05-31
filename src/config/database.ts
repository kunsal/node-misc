import {Sequelize} from 'sequelize';

const sequelize = new Sequelize('postgresql://localhost:5432/misc');

export default sequelize;