import { Router } from 'express';
import { RoundController } from '../controllers/RoundController';
const auth = require('../middleware/auth');
const router = Router();

// Get current round info
router.get(
    '/games/:gameId/current-round',
    auth,
    RoundController.getCurrentRound
);
router.post(
    '/games/:gameId/definitions',
    auth,
    RoundController.createRoundDefinition
);

export default router;
