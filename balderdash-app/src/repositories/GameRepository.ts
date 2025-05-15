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
	game_id, user_id, score, active)
	VALUES (${gameId}, ${playerId}, ${0}, true);
    `;

        if (!result) return false;

        return true;
    }

    static async updatePlayersScore(
        gameId: number,
        scoreMap: { [userId: number]: number }
    ): Promise<{ userId: number; currentScore: number }[]> {
        const updates = Object.entries(scoreMap);
        if (updates.length === 0)
            return await this.getUsersUpdatedScores(gameId);

        // Build CASE WHEN clauses
        const cases = updates.map(
            ([userId, scoreDelta]) =>
                sql`WHEN user_id = ${userId} THEN score + ${scoreDelta} `
        );

        // Combine cases into a single SQL fragment
        const caseFragment = cases.reduce((acc, curr) => sql`${acc} ${curr}`);

        const userIds = updates.map(([userId]) => parseInt(userId));

        // Run the update
        await sql`
        UPDATE game_players
        SET score = CASE 
          ${caseFragment}
          ELSE score
        END
        WHERE user_id = ANY(${userIds}) AND game_id = ${gameId};
      `;
        // Now return ALL players and their (new) scores for this game
        return await this.getUsersUpdatedScores(gameId);
    }

    static async getUsersUpdatedScores(gameId: number) {
        const rows = await sql`
      SELECT game_players.user_id, users.username, game_players.score FROM game_players 
      JOIN users ON users.id = game_players.user_id
      WHERE game_players.game_id = ${gameId}
      RETURNING game_players.user_id, users.username, game_players.score
      ORDER BY game_players.score DESC;
    `;

        return rows.map((row) => ({
            userId: row.user_id,
            username: row.username,
            currentScore: row.score,
        }));
    }

    static async setGamePlayerActive(
        gameId: number,
        user_id: number,
        active: boolean
    ) {
        const rows = await sql`
      UPDATE game_players
      SET active = ${active}
      WHERE game_id = ${gameId} AND user_id = ${user_id} 
      RETURNING active;
    `;
        return rows.length > 0;
    }

    static async getGameByUser(userId: number): Promise<Game | null> {
        const [gameRow] = await sql`
          SELECT games.id, games.host_user_id, games.number_rounds, games.time_limit_seconds, games.lobby_code, games.started_at, games.ended_at, games.game_status_id 
          FROM games 
          JOIN game_players ON games.id = game_players.game_id
          WHERE game_players.user_id = ${userId} AND game_players.active = '1'
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

    static async getGameByRoundId(roundId: number) {
        const [gameRow] = await sql`
          SELECT games.id, games.host_user_id, games.number_rounds, games.time_limit_seconds, games.lobby_code, games.started_at, games.ended_at, games.game_status_id 
          FROM games 
          JOIN rounds ON games.id = rounds.game_id
          WHERE rounds.id = ${roundId}
          ORDER BY games.started_at DESC
          LIMIT 1;
        `;
        if (!gameRow) return null;

        const game = this.mapToGame(gameRow);

        return game;
    }

    static async getRoundCount(gameId: number): Promise<number> {
        const [roundCountResult] = await sql`
          SELECT COUNT(id) AS count 
          FROM rounds 
          WHERE rounds.game_id = ${gameId}
        `;
        if (!roundCountResult) return 0;

        return roundCountResult.count;
    }
}
