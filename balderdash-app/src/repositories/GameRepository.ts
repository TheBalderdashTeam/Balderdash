import sql from '../configuration/DatabaseConfig';
import { Game } from '../types/Game';

enum GameStatus {
  Pending = 1,
  Active = 2,
  Ended = 3,
}

export class GameRepository {

  static async createGame(hostUserId: number, numberRounds: number, timeLimitSeconds: number, lobbyCode: string, statusId: number): Promise<Game> {
    const [gameRow] = await sql`
      INSERT INTO games (host_user_id, number_rounds, time_limit_seconds, lobby_code, game_status_id)
      VALUES (${hostUserId}, ${numberRounds}, ${timeLimitSeconds}, ${lobbyCode}, ${statusId})
      RETURNING id, host_user_id, number_rounds, time_limit_seconds, lobby_code, started_at, ended_at, game_status_id;
    `;

    return this.mapToGame(gameRow);
  }

  static async updateGameStatus(gameId: number, statusId: number): Promise<Game | null> {
    const games = await sql`
      UPDATE games SET game_status_id = ${statusId}
      WHERE id = ${gameId}
      RETURNING id, host_user_id, number_rounds, time_limit_seconds, lobby_code, started_at, ended_at, game_status_id;
    `;

    const gameRow = games[0];
    return gameRow ? this.mapToGame(gameRow) : null;
  }

  static async endGame(gameId: number): Promise<Game | null> {
  const [gameRow] = await sql`
    UPDATE games 
    SET ended_at = NOW(), game_status_id = ${GameStatus.Ended}
    WHERE id = ${gameId}
    RETURNING id, host_user_id, number_rounds, time_limit_seconds, lobby_code, started_at, ended_at, game_status_id;
  `;

  return gameRow ? this.mapToGame(gameRow) : null;
}


  static async deleteGame(gameId: number): Promise<void> {
    await sql`
      DELETE FROM games WHERE id = ${gameId};
    `;
  }

  static async getGameById(gameId: number): Promise<Game | null> {
    const games = await sql`
      SELECT id, host_user_id, number_rounds, time_limit_seconds, lobby_code, started_at, ended_at, game_status_id
      FROM games
      WHERE id = ${gameId}
      LIMIT 1;
    `;

    const gameRow = games[0];
    return gameRow ? this.mapToGame(gameRow) : null;
  }

  static async getGameByLobbyCode(lobbyCode: string): Promise<Game | null> {
  const [gameRow] = await sql`
    SELECT id, host_user_id, number_rounds, time_limit_seconds, lobby_code, started_at, ended_at, game_status_id
    FROM games
    WHERE lobby_code = ${lobbyCode}
    LIMIT 1
  `;

  return gameRow ? this.mapToGame(gameRow) : null;
}


  private static mapToGame(row: any): Game {
    return {
      id: row.id,
      hostUserId: row.host_user_id,
      numberRounds: row.number_rounds,
      timeLimitSeconds: row.time_limit_seconds,
      lobbyCode: row.lobby_code,
      startedAt: row.started_at,
      endedAt: row.ended_at,
      gameStatusId: row.game_status_id
    };
  }

}
