import {Sequelize, DataType, Model, DataTypes} from 'sequelize';
import sequelize from '../../config/database';

interface QuestionInterface {
    id: number,
    question: string,
    isTrueOrFalse?: boolean,
    option1: string,
    option2: string,
    option3?: string,
    option4?: string,
    answer: string,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date
}

class Question extends Model<QuestionInterface> {}

Question.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    question: {
        type: DataTypes.STRING,
        allowNull: false
    },
    option1: {
        type: DataTypes.STRING,
        allowNull: false
    },
    option2: {
        type: DataTypes.STRING,
        allowNull: false
    },
    option3: {
        type: DataTypes.STRING,
        allowNull: true
    },
    option4: {
        type: DataTypes.STRING,
        allowNull: true
    },
    answer: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isTrueOrFalse: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }

}, {
    timestamps: true,
    sequelize: sequelize,
    paranoid: true
});

Question.sync({alter: true});

export default Question;