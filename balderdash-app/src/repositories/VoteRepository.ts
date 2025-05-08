import sql from '../configuration/DatabaseConfig';

export class VoteRepository {
    static async createVote(roundId: number, voterUserId: number, submissionId: number): Promise<Vote> {
        const [voteRow] = await sql`
      INSERT INTO votes (round_id, voter_user_id, submission_id)
      VALUES (${roundId}, ${voterUserId}, ${submissionId})
      RETURNING round_id, voter_user_id, submission_id;
    `;

        const vote: Vote =
        {
            id: voteRow.id,
            roundId: voteRow.round_id,
            voterUserId: voteRow.voter_user_id,
            submissionId: voteRow.submission_id,
            votedAt: voteRow.voted_at
        }

        return vote;
    }

    static async getVotesForRound(roundId: number): Promise<Vote | null> {
        const voteInfo = await sql`
      SELECT round_id, voter_user_id, submission_id FROM votes WHERE round_id = ${roundId};
    `;

        const voteRow = voteInfo[0];

        if (!voteRow) return null;

        const vote: Vote =
        {
            id: voteRow.id,
            roundId: voteRow.round_id,
            voterUserId: voteRow.voter_user_id,
            submissionId: voteRow.submission_id,
            votedAt: voteRow.voted_at
        }

        return vote;
    }

    static async getVoteByUserInRound(roundId: number, voterUserId: number): Promise<Vote | null> {
        const voteInfo = await sql`
      SELECT id, round_id, voter_user_id, submission_id, voted_at FROM votes WHERE round_id = ${roundId} AND voter_user_id = ${voterUserId};
    `;

        const voteRow = voteInfo[0]

        if (!voteRow) return null;

        const vote: Vote =
        {
            id: voteRow.id,
            roundId: voteRow.round_id,
            voterUserId: voteRow.voter_user_id,
            submissionId: voteRow.submission_id,
            votedAt: voteRow.voted_at
        }

        return vote;
    }
}
