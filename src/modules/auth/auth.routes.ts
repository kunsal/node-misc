import {Router} from 'express';
import { login, refresh } from './auth.controller';

const router = Router();

router.post('/login', login);
router.post('/refresh', refresh);

export default router;