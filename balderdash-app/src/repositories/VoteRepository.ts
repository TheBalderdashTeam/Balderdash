import sql from '../configuration/DatabaseConfig';
import { Vote } from '../types/Vote';

export class VoteRepository {
    static async createVote(
        roundId: number,
        voterUserId: number,
        roundDefinitionId: number | null,
        isCorrect: boolean
    ): Promise<Vote> {
      let voteRow;

      if (isCorrect) {
          [voteRow] = await sql`
              INSERT INTO votes (round_id, voter_user_id, is_correct)
              VALUES (${roundId}, ${voterUserId}, ${isCorrect})
              RETURNING id, round_id, voter_user_id, round_definition_id, is_correct, voted_at;
          `;
      } else {
          [voteRow] = await sql`
              INSERT INTO votes (round_id, voter_user_id, round_definition_id, is_correct)
              VALUES (${roundId}, ${voterUserId}, ${roundDefinitionId}, ${isCorrect})
              RETURNING id, round_id, voter_user_id, round_definition_id, is_correct, voted_at;
          `;
      }
        return this.mapToVote(voteRow);
    }

    static async getVotesForRound(roundId: number): Promise<Vote[]> {
        const voteRows = await sql`
      SELECT id, round_id, voter_user_id, round_definition_id, is_correct, voted_at FROM votes WHERE round_id = ${roundId};
    `;

        return voteRows.map(this.mapToVote);
    }

    static async getVoteByUserInRound(
        roundId: number,
        voterUserId: number
    ): Promise<Vote | null> {
        const voteInfo = await sql`
      SELECT id, round_id, voter_user_id, round_definition_id, is_correct, voted_at FROM votes 
      WHERE round_id = ${roundId} AND voter_user_id = ${voterUserId};
    `;

        const voteRow = voteInfo[0];
        return voteRow ? this.mapToVote(voteRow) : null;
    }

    private static mapToVote(row: any): Vote {
        return {
            id: row.id,
            roundId: row.round_id,
            voterUserId: row.voter_user_id,
            roundDefinitionId: row.round_definition_id,
            isCorrect: row.is_correct,
            votedAt: row.voted_at,
        };
    }
}
