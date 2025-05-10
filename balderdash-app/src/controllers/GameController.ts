import { Request, Response } from 'express';
import { GameService } from '../services/GameService';

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
            const gameId = parseInt(req.params.id);

            GameService.startGame(gameId);
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
}
