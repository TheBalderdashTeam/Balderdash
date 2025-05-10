import { GameRepository } from '../repositories/GameRepository';
import { RoundRepository } from '../repositories/RoundRepository';
import { VoteRepository } from '../repositories/VoteRepository';
import { Round } from '../types/Round';
import { RoundDefinition } from '../types/RoundDefinition';
import { RoundState } from '../types/RoundState';
import { shuffleArray } from '../utils/shuffleArray'
import { WordService } from './WordService';

export class RoundService {
  
   static async createRound(
        gameId: number,
        roundNumber: number
    ): Promise<Round | null> {
        const word = await WordService.getRandomWord();
 
        if (!word) return null;
 
        return await RoundRepository.createRound(gameId, word.id, roundNumber);
    }
 
    static async updateRoundState(
        roundId: number,
        state: RoundState
    ): Promise<Round | null> {
        return await RoundRepository.updateRoundState(roundId, state);
    }
 
    static async getCurrentRound(gameId: number) {
        const round = await RoundRepository.getLatestRoundByGameId(gameId);
        if (!round) return null;
 
        // const word = await RoundRepository.getWordById(round.word_id);
        const definitions = await RoundRepository.getDefinitionsByRoundId(
            round.id
        );
 
        const shuffledDefinitions = shuffleArray(definitions);
 
        // return {
        //   roundId: round.id,
        //   roundNumber: round.round_number,
        //   word: word.word,
        //   definitions: shuffledDefinitions
        // };
    }
 
    static async createRoundDefinition(
        roundId: number,
        playerId: number,
        definition: string,
        wordId: number
    ): Promise<RoundDefinition | null> {
        const roundDefinition = await RoundRepository.createRoundDefinition(
            roundId,
            playerId,
            definition,
            wordId
        );
 
        return roundDefinition;
    }

    static async endRoundAndCalculateScores(gameId: number) {
    // Get latest round
    const round = await RoundRepository.getLatestRoundByGameId(gameId);
    if (!round) throw new Error("Round not found");
    const roundId = round.id;

    console.log('Round:' , roundId)

    // Get all votes for the round
    const votes = await VoteRepository.getVotesForRound(roundId);

    console.log('Votes:' , votes);

    // Get all definitions for this round so we can determine their authors
    const definitions = await RoundRepository.getDefinitionsByRoundId(roundId);

     console.log('Definitions:' , definitions);


    // Map definitionId -> authorUserId
    const definitionAuthorMap: { [definitionId: number]: number } = {};
    definitions.forEach((def) => {
        if (def.id != null && def.userId != null) {
            definitionAuthorMap[def.id] = def.userId;
        }
    });

    console.log(definitionAuthorMap);

    const scoreMap: { [userId: number]: number } = {};

    for (const vote of votes) {
        // +2 if correct vote
        if (vote.isCorrect) {
            scoreMap[vote.voterUserId] = (scoreMap[vote.voterUserId] || 0) + 2;
        } else {
            // +1 to author of fake definition
            const authorUserId = definitionAuthorMap[vote.roundDefinitionId];
            if (authorUserId && authorUserId !== vote.voterUserId) {
                scoreMap[authorUserId] = (scoreMap[authorUserId] || 0) + 1;
            }
        }
    }

    console.log(scoreMap);

    // Apply score updates in DB
    await GameRepository.updatePlayersScore(gameId, scoreMap);

    return scoreMap;
}

}

