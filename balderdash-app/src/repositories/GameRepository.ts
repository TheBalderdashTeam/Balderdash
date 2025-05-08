import sql from '../configuration/DatabaseConfig'

export class GameRepository {
    static async getGameById(gameId: number): Promise<Game> {
        const [gameRow] = await sql`
      SELECT id, host_user_id, number_rounds, time_limit_seconds, started_at, ended_at, status_id
      FROM games
      WHERE id = ${gameId}
      LIMIT 1
    `
        const game: Game = {
            id: gameRow.Id,
            hostUserId: gameRow.host_user_id,
            numberRounds: gameRow.number_rounds,
            timeLimitSeconds: gameRow.time_limit_seconds,
            startedAt: gameRow.started_at,
            endedAt: gameRow.ended_at,
            statusId: gameRow.status_id,
        }
        return game
    }
}
