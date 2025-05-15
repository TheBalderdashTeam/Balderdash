import { Router } from 'express';
import { RoundController } from '../controllers/RoundController';
const auth = require('../middleware/auth');
const router = Router();

// Get current round info
router.get('/games/current-round', auth, RoundController.getCurrentRound);
router.post('/games/definitions', auth, RoundController.createRoundDefinition);

// End round and calculate scores
router.post('/games/end-round', auth, RoundController.endRound);
router.get('/games/get-round-scores', auth, RoundController.getRoundScores);

export default router;
