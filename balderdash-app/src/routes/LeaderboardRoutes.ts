import { Router } from 'express';
import { LeaderboardController } from '../controllers/LeaderboardController';
const auth = require('../middleware/auth');
const router = Router();

router.get('/leaderboard', auth, LeaderboardController.getLeaderboard);

export default router;
