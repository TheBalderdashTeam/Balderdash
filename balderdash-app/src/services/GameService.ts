import { GameRepository } from '../repositories/GameRepository';
import { Game } from '../types/Game';
import { generateLobbyCode } from '../utils/LobbyCodeGenerator';

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


    return await GameRepository.createGame(hostUserId, numberRounds, timeLimitSeconds, lobbyCode, statusId);
  }

  static async updateGameStatus(gameId: number, statusId: number): Promise<Game | null> {
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
