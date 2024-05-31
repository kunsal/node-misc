import { Request, Response } from "express";
import { authValidation } from "./auth.validation";
import User from "../user/user.model";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import Role from "../role/role.model";
import AuthModel, { IAuth } from "./auth.model";
import { Op } from "sequelize";
import { JwtPayload } from "../core/app.interfaces";

export const login = async (req: Request, res: Response) => {
    const {error} = authValidation.validate(req.body);

    if (error) {
        return res.status(400).send({
            error: true,
            message: error.details[0].message
        })
    }

    const user = await User.findOne({where: {email: req.body.email}, include: {model: Role, as: "role", attributes: ['id', 'name']}});
    if (!user) {
        return res.status(400).send({
            error: true,
            message: 'Invalid email and/or password 1'
        })
    }
    const password = user.getDataValue('password') || '';

    const isValidPassword = await bcrypt.compare(req.body.password, password);
    if (!isValidPassword) {
        return res.status(400).send({
            error: true,
            message: 'Invalid email and/or password'
        })
    }
    const jwtSecretKey = process.env.JWT_SECRET_KEY || '';
    // sign access token
    const accessToken = jwt.sign({
        id: user.getDataValue('id'),
        email: user.getDataValue('email'),
        roleId: user.getDataValue('roleId')
    }, jwtSecretKey, { expiresIn: 10 });

    // sign refresh token
    const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET || '';
    const refreshToken = jwt.sign({
        id: user.getDataValue('id')
    }, refreshTokenSecret, {expiresIn: 60 * 60});
    // Keep token --- Implementation to be replaced with redis cache
    await AuthModel.create(<IAuth> {
        token: accessToken,
        refreshToken: refreshToken,
        expiresAt: new Date(Date.now() + (3600 * 1000))
    })

    delete user.dataValues.password;

    res.send({
        error: false,
        message: 'Logged in succesfully',
        data: {...user.dataValues, accessToken, refreshToken}
    })
    
}

export const refresh = async (req: Request, res: Response) => {
    const oldToken = req.headers.authorization?.split(' ')[1] as string;
    const refreshToken = req.body.refreshToken;
    if (!(refreshToken && oldToken)) {
        return res.status(401).send('Either refresh token or access token is missing');;
    }
    const savedRefreshToken = await AuthModel.findOne({where: {
        token: oldToken, 
        refreshToken,
        expiresAt: {[Op.gt]: new Date(Date.now())}
    }});
    if (!savedRefreshToken) {
        return res.status(401).send('Not saved refresh token');
    }
    // Generate new access token
    const decoded = jwt.decode(oldToken) as JwtPayload | null;
    const token = jwt.sign(<JwtPayload>{
        id: decoded?.id,
        email: decoded?.email,
        roleId: decoded?.roleId
    }, process.env.JWT_SECRET_KEY || '', {expiresIn: 10});
    // Keep token --- Implementation to be replaced with redis cache
    await savedRefreshToken
        .set('expiresAt', new Date(Date.now() + (3600 * 1000)))
        .set('token', token)
        .save();

    res.send({
        error: false,
        data: {
            token,
            refreshToken
        },
        message: 'Token refreshed'
    })
}