import { Router } from 'express';
import { GameController } from '../controllers/GameController';
const auth = require('../middleware/auth');
const router = Router();

router.post('/games', auth, GameController.createGame);
router.get('/games', auth, GameController.getPlayerGame);
router.post('/games/start', auth, GameController.startGame);
router.patch('/games/status', auth, GameController.updateGameStatus);
router.post('/games/leave', auth, GameController.leaveGame);
router.patch('/games/end', auth, GameController.endGame);
router.delete('/games', auth, GameController.deleteGame);
router.get('/games/:id', auth, GameController.getGameById);
router.post('/games/:lobbyCode', auth, GameController.addPlayerToGame);
router.post('/games/score', auth, GameController.getGameScores);

export default router;
