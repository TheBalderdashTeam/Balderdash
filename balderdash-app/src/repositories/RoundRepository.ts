import sql from '../configuration/DatabaseConfig';

export class RoundRepository {
    static async getLatestRoundByGameId(gameId: number): Promise<Round> {
        const [roundRow] = await sql`
      SELECT id, game_id, word_id, round_number 
      FROM rounds
      WHERE game_id = ${gameId}
      ORDER BY round_number DESC
      LIMIT 1
    `;
        const round: Round = {
            id: roundRow.id,
            gameId: roundRow.game_id,
            wordId: roundRow.word_id,
            roundNumber: roundRow.round_number,
        };
        return round;
    }

    static async getDefinitionsByRoundId(
        roundId: number
    ): Promise<RoundDefinition[]> {
        const [definitionRows] = await sql`
      SELECT rd.id, rd.round_id, rd.user_id, rd.defintion, rd.word_id, rd.submitted_at
      FROM round_definitions rd
      LEFT JOIN users u ON rd.user_id = u.id
      WHERE rd.round_id = ${roundId}
    `;
        const definitions: RoundDefinition[] = [];

        definitionRows.Map(
            (definitionRow: {
                submission_id: number;
                roundId: number;
                user_id?: number;
                definition: string;
                word_id: number;
                submittedAt: Date;
            }) => {
                const definition: RoundDefinition = {
                    id: definitionRow.submission_id,
                    roundId: definitionRow.roundId,
                    userId: definitionRow.user_id,
                    definition: definitionRow.definition,
                    wordId: definitionRow.word_id,
                    submittedAt: definitionRow.submittedAt,
                };
                definitions.push(definition);
            }
        );

        return definitions;
    }
}
