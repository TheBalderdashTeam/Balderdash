import { Router } from 'express';
import { VoteController } from '../controllers/VoteController';
const auth = require('../middleware/auth');
const router = Router();

router.post('/votes/:roundDefinitionId', auth, VoteController.createVote);
router.get('/votes', auth, VoteController.getVotesForRound);
router.get('/votes/:voterUserId', auth, VoteController.getVoteByUserInRound);

export default router;
