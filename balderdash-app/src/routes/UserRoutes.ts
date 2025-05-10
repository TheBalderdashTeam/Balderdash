import { Router } from 'express';
import { UserController } from '../controllers/UserController';
const auth = require('../middleware/auth');
const router = Router();

router.get('/user', auth, UserController.getUser);

export default router;
