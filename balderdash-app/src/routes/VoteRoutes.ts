import { Router } from 'express';
import { VoteController } from '../controllers/VoteController';

const router = Router();

router.post('/votes', VoteController.createVote);
router.get('/rounds/:roundId/votes', VoteController.getVotesForRound);
router.get('/rounds/:roundId/votes/:voterUserId', VoteController.getVoteByUserInRound);

export default router;
