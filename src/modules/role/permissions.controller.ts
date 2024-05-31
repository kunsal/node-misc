import {Request, Response} from 'express';
import { Permissions } from '../core/app.interfaces';

export const getPermissions = (req: Request, res: Response) => {
    const permissions: string[] = Object.values(Permissions);
    res.send(permissions);
}