import { Router } from 'express';
import { RoundController } from '../controllers/RoundController';
//import { isAuthenticated } from '../modules/auth/AuthRoutes';

const router = Router();

// Get current round info
router.get('/games/:gameId/current-round', RoundController.getCurrentRound);

export default router;
