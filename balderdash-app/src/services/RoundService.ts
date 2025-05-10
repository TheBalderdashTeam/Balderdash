import { RoundRepository } from '../repositories/RoundRepository';
import { Round } from '../types/Round';
import { RoundDefinition } from '../types/RoundDefinition';
import { RoundState } from '../types/RoundState';
import { shuffleArray } from '../utils/shuffleArray';
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
}
