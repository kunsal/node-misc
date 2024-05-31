import {Request, Response} from 'express';
import createUserValidation from './user.validation';
import User, { IUser, IUserRegistration } from './user.model';
import Role from '../role/role.model';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import { AuthRequest } from '../core/app.interfaces';

export const create = async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        const {error} = createUserValidation.validate(req.body);

        if (error) {
            return res.status(400).send({
                error: true,
                message: error.details[0].message
            })
        }
        if (!req.body.roleId || req.body.roleId === null) {
            const defaultRole = await Role.findOne({where: {id: process.env.DEFAULT_ROLE_ID}});
            if (!defaultRole) {
                return res.status(400).send({
                    error: true,
                    message: 'No default role defined'
                })
            }
            req.body.roleId = defaultRole.getDataValue('id');
        } else {
            const role = await Role.findOne({where: {id: req.body.roleId}});
            if (!role) {
                return res.status(400).send({
                    error: true,
                    message: 'Invalid role supplied'
                })
            }
        }
        const userExists = await User.findOne({where: {email: req.body.email}});
        if (userExists) {
            return res.status(400).send({
                error: true,
                message: 'User with email already exists'
            })
        }
        const password = await bcrypt.hash(req.body.password, 10);

        const user = await User.create(<IUserRegistration>{
            name: req.body?.name,
            email: req.body?.email,
            roleId: req.body.roleId,
            password
        });
        delete user.dataValues.password;
        delete user.dataValues.roleId;
        res.send({
            error: false,
            data: user.dataValues,
            message: 'User created successfully'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: true,
            message: 'Something went wrong'
        })
    }
    
}

export const fetch = async (req: AuthRequest, res: Response) => {
    try {
        const {page, perPage} = req.query;
        const limit: number = parseInt(perPage as string);
        const offset: number = (parseInt(page as string) - 1) * limit;
        const users = await User.findAll({attributes: ['name', 'email', 'roleId', 'createdAt'], limit, offset});
        const totalRecords = await User.count();
        const totalPages = Math.ceil(totalRecords/limit)
        const currentPage = (parseInt(page as string) <= totalPages) ? page : totalPages;

        res.send({
            error: false,
            data: users, 
            metaData: {currentPage, totalPages, totalRecords},
            message: 'Users fetched successfully'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: true,
            message: 'Something went wrong'
        })
    }
}