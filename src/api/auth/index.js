import * as controller from './controller';
import { Router } from 'express';
const router = new Router()

router.post('/register', controller.registerUser)
router.post('/login', controller.loginUser);
router.get('/logout', controller.logout);
export default router;