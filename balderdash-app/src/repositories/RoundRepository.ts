import sql from '../configuration/DatabaseConfig';

export class RoundRepository {
  static async getLatestRoundByGameId(gameId: number) {
    const [round] = await sql`
      SELECT id, game_id, word_id, round_number 
      FROM rounds
      WHERE game_id = ${gameId}
      ORDER BY round_number DESC
      LIMIT 1
    `;
    return round;
  }

  static async getWordById(wordId: number) {
    const [word] = await sql`
      SELECT word, definition FROM words WHERE id = ${wordId}
    `;
    return word;
  }

  static async getDefinitionsByRoundId(roundId: number) {
    return await sql`
      SELECT 
        rd.id AS submission_id,
        rd.defintion,
        u.username AS submitted_by_username
      FROM round_definitions rd
      LEFT JOIN users u ON rd.user_id = u.id
      WHERE rd.round_id = ${roundId}
    `;
  }
}
