import { RoundRepository } from '../repositories/RoundRepository';
import { shuffleArray } from '../utils/shuffleArray'

export class RoundService {
  static async getCurrentRound(gameId: number) {
    const round = await RoundRepository.getLatestRoundByGameId(gameId);
    if (!round) return null;

    // const word = await RoundRepository.getWordById(round.word_id);
    const definitions = await RoundRepository.getDefinitionsByRoundId(round.id);

    const shuffledDefinitions = shuffleArray(definitions);

    // return {
    //   roundId: round.id,
    //   roundNumber: round.round_number,
    //   word: word.word,
    //   definitions: shuffledDefinitions
    // };
  }
}
