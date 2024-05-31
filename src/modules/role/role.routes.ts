import Router from 'express';
import { create, fetchAll, fetchOne, update } from './role.controller';
import { getPermissions } from './permissions.controller';

const router = Router();

router.post('/', create);
router.get('/', fetchAll);
router.get('/:id', fetchOne);
router.put('/:id', update);
router.get('/permissions', getPermissions);

export default router;