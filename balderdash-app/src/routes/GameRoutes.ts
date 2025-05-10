import { Router } from 'express';
import { GameController } from '../controllers/GameController';

const router = Router();

router.post('/games', GameController.createGame);
router.post('/games/:id/start', GameController.startGame);
router.patch('/games/:id/status', GameController.updateGameStatus);
router.patch('/games/:id/end', GameController.endGame);
router.delete('/games/:id', GameController.deleteGame);
router.get('/games/:id', GameController.getGameById);

export default router;
