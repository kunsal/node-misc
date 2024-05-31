import { NextFunction, Response } from "express"
import { AuthRequest, Permissions } from "../core/app.interfaces";
import Role from "./role.model";

export const hasPermission = (permission: string) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        const role = await Role.findOne({where: {id: req.userData?.roleId}});
        if (!role) {
            return res.sendStatus(403);
        }
        const permissions: string[] = JSON.parse(role.getDataValue('permissions') as string);

        const isValidPermission = permissions.find((p) => p === permission);
        
        if (!isValidPermission) {
            return res.sendStatus(403);
        }
        next();
    }
}