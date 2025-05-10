import { Request, Response } from 'express';
import { VoteService } from '../services/VoteService';

export class VoteController {
    static async createVote(req: Request, res: Response): Promise<void> {
        try {
            const { roundId, voterUserId, roundDefintionId } = req.body;
            const vote = await VoteService.createVote(roundId, voterUserId, roundDefintionId);
            res.status(200).json(vote);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error creating vote' });
        }
    }

    static async getVotesForRound(req: Request, res: Response): Promise<void> {
        try {
            const roundId = parseInt(req.params.roundId);
            const votes = await VoteService.getVotesForRound(roundId);
            res.status(200).json(votes);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching votes' });
        }
    }

    static async getVoteByUserInRound(req: Request, res: Response): Promise<void> {
        try {
            const roundId = parseInt(req.params.roundId);
            const voterUserId = parseInt(req.params.voterUserId);
            const vote = await VoteService.getVoteByUserInRound(roundId, voterUserId);

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
