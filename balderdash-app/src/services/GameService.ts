import { GameRepository } from '../repositories/GameRepository';
import { Game } from '../types/Game';
import { GameState } from '../types/GameState';
import { generateLobbyCode } from '../utils/LobbyCodeGenerator';
import { RoundService } from './RoundService';

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

        //TODO: First round, 0 or 1?
        await RoundService.createRound(game.id, 0);

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
}
