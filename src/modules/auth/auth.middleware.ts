import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import 'dotenv/config';
import { AuthRequest, JwtPayload } from "../core/app.interfaces";

export const isLoggedIn = () => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const authorization: string = req.headers?.authorization as string;
            if (!authorization || !authorization?.startsWith('Bearer ')) {
                return res.send({
                    error: true,
                    message: 'Invalid authorization header'
                }).status(400);
            }
            const tokenArr: string[] = authorization?.split(' ');
            const jwtSecretKey = process.env.JWT_SECRET_KEY || '';
            const token = tokenArr[1];
            const isValidToken = jwt.verify(token, jwtSecretKey);
            if (!isValidToken) {
                 return res.status(401).send({
                    error: true,
                    message: 'Unauthorized to access resource'
                })
            }
            const decoded = jwt.decode(token) as JwtPayload || null;

            req.userData = {
                id: decoded?.id,
                email: decoded?.email,
                roleId: decoded?.roleId
            }

            next();
        } catch (error) {
            console.log(error);
            return res.status(403).send({
                error: true,
                message: 'Token expired'
            })
        }
    }
}