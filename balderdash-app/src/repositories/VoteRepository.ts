import sql from '../configuration/DatabaseConfig';
import { Vote } from '../types/Vote';

export class VoteRepository {

  static async createVote(roundId: number, voterUserId: number, submissionId: number): Promise<Vote> {
    const [voteRow] = await sql`
      INSERT INTO votes (round_id, voter_user_id, submission_id)
      VALUES (${roundId}, ${voterUserId}, ${submissionId})
      RETURNING id, round_id, voter_user_id, submission_id, voted_at;
    `;

    return this.mapToVote(voteRow);
  }

    static async getVotesForRound(roundId: number): Promise<Vote[]> {
    const voteRows = await sql`
      SELECT id, round_id, voter_user_id, submission_id, voted_at FROM votes WHERE round_id = ${roundId};
    `;

    return voteRows.map(this.mapToVote);
  }

  static async getVoteByUserInRound(roundId: number, voterUserId: number): Promise<Vote | null> {
    const voteInfo = await sql`
      SELECT id, round_id, voter_user_id, submission_id, voted_at FROM votes 
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
      submissionId: row.submission_id,
      votedAt: row.voted_at
    };
  }
}
