import { Request } from 'express';

export type JwtPayload = {
    id: number | string,
    email: string,
    roleId: number
}

export interface AuthRequest extends Request {
    userData?: JwtPayload
}

export enum Permissions {
    GET_USERS = "Get Users",
    GET_USER = "Get User",
    GET_ROLES = "Get Roles"
}