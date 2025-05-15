import sql from '../configuration/DatabaseConfig';
import { Round } from '../types/Round';
import { RoundDefinition } from '../types/RoundDefinition';
import { RoundState } from '../types/RoundState';

export class RoundRepository {
    static async createRound(
        gameId: number,
        wordId: number,
        roundNumber: number
    ): Promise<Round | null> {
        const [roundRow] = await sql`INSERT INTO public.rounds(
	game_id, word_id, round_number, round_status_id)
	VALUES (${gameId}, ${wordId}, ${roundNumber}, ${1});`;

        return roundRow ? this.mapToRound(roundRow) : null;
    }

    static async updateRoundState(
        roundId: number,
        state: RoundState
    ): Promise<Round | null> {
        const [roundRow] = await sql`UPDATE rounds
	SET round_status_id=${state}
	WHERE id=${roundId};`;

        return roundRow ? this.mapToRound(roundRow) : null;
    }

    static async getLatestRoundByGameId(gameId: number): Promise<Round | null> {
        const [roundRow] = await sql`
      SELECT id, game_id, word_id, round_number, round_status_id
      FROM rounds
      WHERE game_id = ${gameId}
      ORDER BY round_number DESC
      LIMIT 1
    `;
        return roundRow ? this.mapToRound(roundRow) : null;
    }

    static async getDefinitionsByRoundId(
        roundId: number
    ): Promise<RoundDefinition[]> {
        const definitionRows = await sql`
        SELECT rd.id, rd.round_id, rd.user_id, rd.definition, rd.word_id, rd.submitted_at
        FROM round_definitions rd
        LEFT JOIN users u ON rd.user_id = u.id
        WHERE rd.round_id = ${roundId}
    `;

        return definitionRows.map(this.mapToRoundDefinition);
    }

    static async createRoundDefinition(
        roundId: number,
        playerId: number,
        definition: string | null,
        wordId: number
    ): Promise<RoundDefinition | null> {
        let roundDefinitionRow: any = null;

        if (!definition || definition === undefined) {
            definition = '';
        }

        [roundDefinitionRow] = await sql`INSERT INTO public.round_definitions(
        round_id, user_id, definition, word_id)
        VALUES (${roundId}, ${playerId}, ${definition}, ${wordId})
        RETURNING id, round_id, user_id, definition, word_id, submitted_at;`;

        if (!roundDefinitionRow) return null;

        const roundDefinition = this.mapToRoundDefinition(roundDefinitionRow);

        return roundDefinition;
    }

    private static mapToRound(row: any): Round {
        return {
            id: row.id,
            gameId: row.game_id,
            wordId: row.word_id,
            roundNumber: row.round_number,
            roundStatusId: row.round_status_id,
        };
    }

    private static mapToRoundDefinition(row: any): RoundDefinition {
        return {
            id: row.id,
            gameId: row.game_id,
            userId: row.user_id,
            definition: row.definition,
            wordId: row.word_id,
            submittedAt: row.submitted_at,
        };
    }
}
