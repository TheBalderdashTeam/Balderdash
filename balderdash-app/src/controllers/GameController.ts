import { Request, Response } from 'express';
import { GameService } from '../services/GameService';
import { GameRepository } from '../repositories/GameRepository';
import { GameState } from '../types/GameState';

export class GameController {
    static async createGame(req: Request, res: Response) {
        try {
            const { hostUserId, numberRounds, timeLimitSeconds, statusId } =
                req.body;
            const game = await GameService.createGame(
                hostUserId,
                numberRounds,
                timeLimitSeconds,
                statusId
            );
            res.status(200).json(game);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error creating game' });
        }
    }

    static async startGame(req: Request, res: Response): Promise<any> {
        try {
            const game = await GameService.getPlayerGame(req);

            if (!game)
                return res
                    .status(500)
                    .json({ message: 'Failed to create game' });

            res.status(200).json(game);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error starting game' });
        }
    }

    static async updateGameStatus(req: Request, res: Response): Promise<any> {
        try {
            const gameId = parseInt(req.params.id);
            const { statusId } = req.body;
            const game = await GameService.updateGameStatus(gameId, statusId);
            if (!game)
                return res.status(404).json({ message: 'Game not found' });
            res.status(200).json(game);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error updating game status' });
        }
    }

    static async endGame(req: Request, res: Response): Promise<any> {
        try {
            const gameId = parseInt(req.params.id);
            const game = await GameService.endGame(gameId);
            if (!game)
                return res.status(404).json({ message: 'Game not found' });
            res.status(200).json(game);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error ending game' });
        }
    }

    static async deleteGame(req: Request, res: Response): Promise<any> {
        try {
            const gameId = parseInt(req.params.id);
            await GameService.deleteGame(gameId);
            res.status(200).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error deleting game' });
        }
    }

    static async getGameById(req: Request, res: Response): Promise<any> {
        try {
            const gameId = parseInt(req.params.id);
            const game = await GameService.getGameById(gameId);
            if (!game)
                return res.status(404).json({ message: 'Game not found' });
            res.status(200).json(game);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching game' });
        }
    }

    static async addPlayerToGame(req: Request, res: Response): Promise<any> {
        try {
            const lobbyCode = req.params.lobbyCode;

            if (!lobbyCode)
                res.status(404).json({ message: 'No lobby code provided' });

            const googleUser = req.user;

            if (!googleUser || googleUser == undefined)
                res.status(404).json({ message: 'Invalid token' });

            const currentGame = await GameService.getGameStatus(lobbyCode);

            if (currentGame?.gameStatusId == GameState.Active)
            {
                res.status(404).json({ message: 'Game is already active. You cannot join an active game' });
            }
            
            const result = await GameService.addPlayerToGame(
                lobbyCode,
                googleUser
            );

            if (!result)
                return res
                    .status(404)
                    .json({ message: 'Failed to add player to game' });
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to add player to game' });
        }
    }

    static async getPlayerGame(req: Request, res: Response): Promise<any> {
        try {
            const game = await GameService.getPlayerGame(req);

            if (!game)
                return res.status(404).json({ message: 'Game not found' });
            res.status(200).json(game);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching game' });
        }
    }
}
