import { GameRepository } from '../repositories/GameRepository';
import { Game } from '../types/Game';
import { GameState } from '../types/GameState';
import { GooglePayload } from '../types/GoolePayload';
import { generateLobbyCode } from '../utils/LobbyCodeGenerator';
import { RoundService } from './RoundService';
import { UserService } from './UserService';
import { Request } from 'express';

export class GameService {
    static async createGame(
        hostUserId: number,
        numberRounds: number,
        timeLimitSeconds: number,
        statusId: number
    ): Promise<Game> {
        let lobbyCode: string;
        let existingGame: Game | null;

        do {
            lobbyCode = generateLobbyCode();
            existingGame = await GameRepository.getGameByLobbyCode(lobbyCode);
        } while (existingGame);

        return await GameRepository.createGame(
            hostUserId,
            numberRounds,
            timeLimitSeconds,
            lobbyCode,
            statusId
        );
    }

    static async startGame(gameId: number): Promise<Game | null> {
        const game = await this.getGameById(gameId);
        if (!game) return null;

        await RoundService.createRound(game.id, 1);

        return await GameRepository.updateGameStatus(gameId, GameState.Active);
    }

    static async updateGameStatus(
        gameId: number,
        statusId: number
    ): Promise<Game | null> {
        return await GameRepository.updateGameStatus(gameId, statusId);
    }

    static async endGame(gameId: number): Promise<Game | null> {
        return await GameRepository.endGame(gameId);
    }

    static async getGameStatus(lobbyCode: string): Promise<Game | null> {
        return await GameRepository.getGameByLobbyCode(lobbyCode);
    }

    static async deleteGame(gameId: number): Promise<void> {
        await GameRepository.deleteGame(gameId);
    }

    static async getGameById(gameId: number): Promise<Game | null> {
        try {
            return await GameRepository.getGameById(gameId);
        } catch {
            return null;
        }
    }

    static async addPlayerToGame(
        lobbyCode: string,
        googleUser: GooglePayload | undefined
    ): Promise<boolean> {
        var game = await GameRepository.getGameByLobbyCode(lobbyCode);

        if (!game) return false;

        if (!googleUser) return false;

        const user = await UserService.getUserByGoogleId(googleUser.sub);

        if (!user) return false;

        const gamePlayers = await UserService.getAllPlayersInGame(game.id);

        if (gamePlayers) {
            if (
                gamePlayers.filter((player) => player.id == user.id).length !==
                0
            )
                return false;
        }

        const result = GameRepository.addPlayerToGame(game.id, user.id);

        if (!result) return false;

        return true;
    }

    static async getGameFromGoogleUser(
        googleUser: GooglePayload | undefined
    ): Promise<Game | null> {
      console.log({googleUser});
        if (googleUser == undefined || googleUser == null) return null;

        const user = await UserService.getUserByGoogleId(googleUser.sub);

        if (!user) return null;

        const game = await GameRepository.getGameByUser(user.id);

        return game;
    }

    static async getPlayerGame(req: Request): Promise<Game | null> {
        try {
            const googleUser = req.user;

            if (!googleUser || googleUser == undefined) return null;

            const game = await this.getGameFromGoogleUser(googleUser);

            if (!game) return null;

            return game;
        } catch (error) {
            return null;
        }
    }

    static async removePlayerFromGame(
        userId: number,
        gameId: number
    ): Promise<string> {
        const result = await GameRepository.setGamePlayerActive(
            gameId,
            userId,
            false
        );

        if (result) {
            return 'Player removed from game';
        } else {
            return 'Failed to remove player from game';
        }
    }

    static async getGameByRoundId(roundId: number): Promise<Game | null> {
        const game = GameRepository.getGameByRoundId(roundId);

        return game;
    }

    static async getUsersUpdatedScores(gameId: number): Promise<any> {
        return await GameRepository.getUsersUpdatedScores(gameId);
    }

    static async getRoundCount(gameId: number): Promise<number> {
        return await GameRepository.getRoundCount(gameId);
    }
}
