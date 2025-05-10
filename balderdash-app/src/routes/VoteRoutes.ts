import { Router } from 'express';
import { VoteController } from '../controllers/VoteController';
const auth = require('../middleware/auth');
const router = Router();

router.post('/votes', auth, VoteController.createVote);
router.get('/rounds/:roundId/votes', auth, VoteController.getVotesForRound);
router.get(
    '/rounds/:roundId/votes/:voterUserId',
    auth,
    VoteController.getVoteByUserInRound
);

export default router;
