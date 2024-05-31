import { Request, Response } from "express";
import roleSchema from "./role.validation";
import Role, { IRole } from "./role.model";
import { Op } from "sequelize";

export async function create(req: Request, res: Response) {
    try {
        const { error } = roleSchema.validate(req.body);
        if (error) {
            return res.status(400).send({
                error: true,
                message: error.details[0].message
            })
        }
        const roleExist = await Role.findOne({where: {name: req.body.name}, attributes: ['name']});
        if (roleExist?.getDataValue('name') === req.body.name) {
            return res.status(400).send({
                error: true,
                message: 'Role exists'
            })
        }
        const role = await Role.create(<IRole> {
            name: req.body.name,
            permissions: JSON.stringify(req.body.permissions)
        });
        res.send({
            error: false,
            data: role,
            message: 'Role created successfully'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: true,
            message: 'Something went wrong'
        })
    }
}

export async function fetchAll(req: Request, res: Response) {
    try {
        const roles = await Role.findAll({attributes: ['id', 'name']});
        res.send({
            error: false,
            data: roles,
            message: 'Roles fetched successfully'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: true,
            message: 'Something went wrong'
        })
    }
}

export async function fetchOne(req: Request, res: Response) {
    try {
        const role = await Role.findOne({where: { id: req.params.id }, attributes: ['id', 'name', 'permissions']});
        res.send({
            error: false,
            data: role,
            message: 'Role fetched successfully'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: true,
            message: 'Something went wrong'
        })
    }
}

export async function update(req: Request, res: Response) {
    const role = await Role.findOne({where: {id: req.params.id}});
    if (!role) {
        return res.status(404).send({
            error: true,
            message: 'Role does not exist'
        })
    }
    
    if (req.body.name) {
        if (role.getDataValue('name') !== req.body.name){
            const nameExists = await Role.findOne({where: {name: req.body.name, id: {[Op.ne]: role.getDataValue('id')}}});
            if (nameExists) {
                return res.status(400).send({
                    error: true,
                    message: 'Role name exists'
                })
            }
        }
       role.set('name', req.body.name);
    }

    if (req.body.permissions) {
        role.set('permissions', JSON.stringify(req.body.permissions));
    }

    const updatedRole = await role.save();

    res.send({
        error: false,
        data: updatedRole,
        message: 'Role updated successfully'
    });
}