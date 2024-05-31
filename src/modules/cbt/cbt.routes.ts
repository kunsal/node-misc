import {Router} from 'express';
import { save } from './questions.controller';
import { isLoggedIn } from '../auth/auth.middleware';

const router = Router();

router.post('/questions', isLoggedIn(), save)

export default router;
