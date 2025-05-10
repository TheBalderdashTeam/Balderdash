import { Router } from 'express';
import { UserController } from '../controllers/UserController';
const auth = require('../middleware/auth');
const router = Router();

router.get('/user', auth, UserController.getUser);
router.get('/user/all-players', auth, UserController.getAllGamePlayers);

export default router;
