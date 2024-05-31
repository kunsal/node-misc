import Router from 'express';
import { create, fetch } from './user.controller';
import { isLoggedIn } from '../auth/auth.middleware';
import { hasPermission } from '../role/permissions.middleware';
import { Permissions } from '../core/app.interfaces';

const router = Router();

router.post('/', create);
router.get('/', [isLoggedIn(), hasPermission(Permissions.GET_USERS)], fetch);

export default router;