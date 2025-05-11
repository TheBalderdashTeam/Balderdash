import sql from '../configuration/DatabaseConfig';
import { Game } from '../types/Game';

enum GameStatus {
  Pending = 1,
  Active = 2,
  Ended = 3,
}

export class GameRepository {
  static async createGame(
    hostUserId: number,
    numberRounds: number,
    timeLimitSeconds: number,
    lobbyCode: string,
    statusId: number
  ): Promise<Game> {
    const [gameRow] = await sql`
      INSERT INTO games (host_user_id, number_rounds, time_limit_seconds, lobby_code, game_status_id)
      VALUES (${hostUserId}, ${numberRounds}, ${timeLimitSeconds}, ${lobbyCode}, ${statusId})
      RETURNING id, host_user_id, number_rounds, time_limit_seconds, lobby_code, started_at, ended_at, game_status_id;
    `;

    return this.mapToGame(gameRow);
  }

  static async updateGameStatus(
    gameId: number,
    statusId: number
  ): Promise<Game | null> {
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

  static async addPlayerToGame(
    gameId: number,
    playerId: number
  ): Promise<boolean> {
    const [result] = await sql`
      INSERT INTO public.game_players(
	game_id, user_id, score)
	VALUES (${gameId}, ${playerId}, ${0});
    `;

    if (!result) return false;

    return true;
  }

  static async updatePlayersScore(
    gameId: number,
    scoreMap: { [userId: number]: number }
  ): Promise<{ userId: number; currentScore: number }[]> {
    const updates = Object.entries(scoreMap);

    if (updates.length === 0) return [];

    // Build CASE WHEN clauses
    const cases = updates.map(
      ([userId, scoreDelta]) =>
        sql`WHEN user_id = ${userId} THEN score + ${scoreDelta} `
    );

    // Combine cases into a single SQL fragment
    const caseFragment = cases.reduce((acc, curr) => sql`${acc} ${curr}`);

    const userIds = updates.map(([userId]) => userId);

    // Run the update
      await sql`
        UPDATE game_players
        SET score = CASE 
          ${caseFragment}
          ELSE score
        END
        WHERE user_id IN (${userIds}) AND game_id = ${gameId};
      `;

    // Now return ALL players and their (new) scores for this game
    return await this.getUsersUpdatedScores(gameId);

    
  }

  static async getUsersUpdatedScores(gameId: number)
  {
      const rows = await sql`
      SELECT user_id, score FROM game_players WHERE game_id = ${gameId};
    `;

    return rows.map((row) => ({
      userId: row.user_id,
      currentScore: row.score,
    }));
  }

  static async getGameByUser(userId: number): Promise<Game | null> {
    const [gameRow] = await sql`
          SELECT games.id, games.host_user_id, games.number_rounds, games.time_limit_seconds, games.lobby_code, games.started_at, games.ended_at, games.game_status_id 
          FROM games 
          JOIN game_players ON games.id = game_players.game_id
          WHERE game_players.user_id = ${userId}
          ORDER BY games.started_at DESC
          LIMIT 1;
        `;
    if (!gameRow) return null;

    const game = this.mapToGame(gameRow);

    return game;
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
      gameStatusId: row.game_status_id,
    };
  }
}
