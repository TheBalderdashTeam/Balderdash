import { Router } from 'express';
import { RoundController } from '../controllers/RoundController';

const router = Router();

// Get current round info
router.get('/games/:gameId/current-round', RoundController.getCurrentRound);

export default router;
