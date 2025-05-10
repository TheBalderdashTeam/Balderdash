import { Router } from 'express';
import { GameController } from '../controllers/GameController';
const auth = require('../middleware/auth');
const router = Router();

router.post('/games', auth, GameController.createGame);
router.get('/games', auth, GameController.getPlayerGame);
router.post('/games/:id/start', auth, GameController.startGame);
router.patch('/games/:id/status', auth, GameController.updateGameStatus);
router.patch('/games/:id/end', auth, GameController.endGame);
router.delete('/games/:id', auth, GameController.deleteGame);
router.get('/games/:id', auth, GameController.getGameById);
router.post('/games/:lobbyCode', auth, GameController.addPlayerToGame);

export default router;
