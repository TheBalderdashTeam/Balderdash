import { VoteRepository } from '../repositories/VoteRepository';
import { Vote } from '../types/Vote';

export class VoteService {
    static async createVote(
        roundId: number,
        voterUserId: number,
        roundDefintionId: number | null,
        isCorrect: boolean
    ): Promise<Vote> {
        return await VoteRepository.createVote(
            roundId,
            voterUserId,
            roundDefintionId,
            isCorrect
        );
    }

    static async getVotesForRound(roundId: number): Promise<Vote[]> {
        return await VoteRepository.getVotesForRound(roundId);
    }

    static async getVoteByUserInRound(
        roundId: number,
        voterUserId: number
    ): Promise<Vote | null> {
        return await VoteRepository.getVoteByUserInRound(roundId, voterUserId);
    }
}
