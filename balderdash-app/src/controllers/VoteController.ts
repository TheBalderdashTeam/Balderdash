import { Request, Response } from 'express';
import { VoteService } from '../services/VoteService';
import { UserService } from '../services/UserService';
import { RoundService } from '../services/RoundService';

export class VoteController {
    static async createVote(req: Request, res: Response): Promise<void> {
        try {
            const roundDefinitionId = parseInt(req.params.roundDefinitionId);

            const googleUser = req.user;

            if (!googleUser || googleUser == undefined)
                res.status(404).json({ message: 'Invalid token' });

            const user = await UserService.getUserByGoogleId(
                googleUser?.sub ?? ''
            );

            const roundData = await RoundService.getPlayerRound(req);

            if (!roundData)
                res.status(404).json({ message: 'No active round found' });

            const vote = await VoteService.createVote(
                roundData.roundId,
                user?.id ?? 0,
                roundDefinitionId
            );
            res.status(200).json(vote);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error creating vote' });
        }
    }

    static async getVotesForRound(req: Request, res: Response): Promise<void> {
        try {
            const roundData = await RoundService.getPlayerRound(req);

            if (!roundData)
                res.status(404).json({ message: 'No active round found' });

            const votes = await VoteService.getVotesForRound(
                roundData.roundId ?? 0
            );
            res.status(200).json(votes);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching votes' });
        }
    }

    static async getVoteByUserInRound(
        req: Request,
        res: Response
    ): Promise<void> {
        try {
            const roundId = parseInt(req.params.roundId);
            const voterUserId = parseInt(req.params.voterUserId);
            const vote = await VoteService.getVoteByUserInRound(
                roundId,
                voterUserId
            );

            if (!vote) {
                res.status(404).json({ message: 'Vote not found' });
            }

            res.status(200).json(vote);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching vote' });
        }
    }
}
