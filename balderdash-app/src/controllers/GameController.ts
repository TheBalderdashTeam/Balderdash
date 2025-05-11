import e, { Request, Response } from 'express';
import { GameService } from '../services/GameService';
import { GameState } from '../types/GameState';
import {handleSuccess, handleFailure} from '../utils/handleResponses';

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
             handleSuccess(res, game);
        } catch (error) {
            handleFailure(res, error, 'Error occured while creating the game');
        }
    }

    static async startGame(req: Request, res: Response): Promise<any> {
        try {
            const game = await GameService.getPlayerGame(req);

            if (!game)
                return res
                    .status(500)
                    .json({ message: 'Failed to start game' });

            res.status(200).json(game);
        } catch (error) {
            handleFailure(res, error, 'Error occured when starting game');
        }
    }

    static async updateGameStatus(req: Request, res: Response): Promise<any> {
        try {
            const gameInfo = await GameService.getPlayerGame(req);
            const { statusId } = req.body;
            
            const game = await GameService.updateGameStatus(gameInfo?.id ?? 0, statusId);

            handleSuccess(res, game);
        } catch (error) {
            handleFailure(res, error, 'Error updating game status');
        }
    }

    static async endGame(req: Request, res: Response): Promise<any> {
        try {
            const gameInfo = await GameService.getPlayerGame(req);
            const game = await GameService.endGame(gameInfo?.id ?? 0);

            handleSuccess(res, game);
        } catch (error) {
            handleFailure(res, error, 'Error ending game');
            console.error(error);
        }
    }

    static async deleteGame(req: Request, res: Response): Promise<any> {
        try {
            const gameInfo = await GameService.getPlayerGame(req);
            await GameService.deleteGame(gameInfo?.id ?? 0);
            res.status(200).json({ message: 'Game succesfully deleted' });
        } catch (error) {
            handleFailure(res, error, 'Error deleting game');
        }
    }

    static async getGameById(req: Request, res: Response): Promise<any> {
        try {
            const gameId = parseInt(req.params.id);
            const game = await GameService.getGameById(gameId);
            handleSuccess(res, game);
        } catch (error) {
            handleFailure(res, error, 'Error fetching game');
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

            handleSuccess(res, result);
        } catch (error) {
            handleFailure(res, error, 'Failed to add player to game');
        }
    }

    static async getPlayerGame(req: Request, res: Response): Promise<any> {
        try {
            const game = await GameService.getPlayerGame(req);

            if (!game)
                return res.status(404).json({ message: 'Game not found' });
            res.status(200).json(game);
        } catch (error) {
            handleFailure(res, error, 'Error fetching game');
        }
    }
}
