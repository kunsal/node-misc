import {Request, Response} from 'express';
import Question from './question.model';
import { DatabaseError } from 'sequelize';
import schema from './question.validation';

export async function save(req: Request, res: Response) {
    try {
        const {error, value} = schema.validate(req.body);
        if (error) {
            return res.send(error.details[0].message)
        }
        const question = await Question.create(req.body);
        res.send(question)
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
    
}