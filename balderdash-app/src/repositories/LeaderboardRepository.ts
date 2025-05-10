import sql from '../configuration/DatabaseConfig';

export class LeaderboardRepository {
  static async getLeaderboard(): Promise<{ rank: number; username: string; totalScore: number }[]> {
    const rows = await sql`
      SELECT u.username, SUM(gp.score) AS total_score
      FROM users u
      JOIN game_players gp ON u.id = gp.user_id
      GROUP BY u.id
      ORDER BY total_score DESC
      LIMIT 10
    `;

    return rows.map((row: any, index: number) => ({
      rank: index + 1,
      username: row.username,
      totalScore: Number(row.total_score),
    }));
  }
}

