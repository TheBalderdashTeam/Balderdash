import { Request, Response } from 'express';
import { GameService } from '../services/GameService';
import { handleSuccess, handleFailure } from '../utils/handleResponses';
import { GameState } from '../types/GameState';
import { Game } from '../types/Game';
import { UserService } from '../services/UserService';

type GameData = {
    game: Game;
    state: string;
};

export class GameController {
    static async createGame(req: Request, res: Response) {
        try {
            const { numberRounds, timeLimitSeconds } = req.body;

            const googleUser = req.user;

            if (!googleUser || googleUser == undefined)
                res.status(401).json({
                    message: 'Token error, user forbidden',
                });

            const user = await UserService.getUserByGoogleId(
                googleUser?.sub ?? ''
            );

            if (!user) {
                res.status(401).json({
                    message: 'Token error, user forbidden',
                });
            }

            const game = await GameService.createGame(
                user?.id ?? 0,
                numberRounds,
                timeLimitSeconds,
                GameState.Pending
            );

            const result = await GameService.addPlayerToGame(
                game.lobbyCode,
                googleUser
            );

            const gameData = GameController.createGameResponse(game);

            handleSuccess(res, gameData);
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

            const startedGame = await GameService.startGame(game.id);

            handleSuccess(res, GameController.createGameResponse(startedGame));
        } catch (error) {
            handleFailure(res, error, 'Error occured when starting game');
        }
    }

    static async updateGameStatus(req: Request, res: Response): Promise<any> {
        try {
            const gameInfo = await GameService.getPlayerGame(req);
            const { statusId } = req.body;

            const game = await GameService.updateGameStatus(
                gameInfo?.id ?? 0,
                statusId
            );

            handleSuccess(res, GameController.createGameResponse(game));
        } catch (error) {
            handleFailure(res, error, 'Error updating game status');
        }
    }

    static async endGame(req: Request, res: Response): Promise<any> {
        try {
            const gameInfo = await GameService.getPlayerGame(req);
            const game = await GameService.endGame(gameInfo?.id ?? 0);

            handleSuccess(res, GameController.createGameResponse(game));
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
            handleSuccess(res, GameController.createGameResponse(game));
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

            if (currentGame?.gameStatusId == GameState.Active) {
                res.status(404).json({
                    message:
                        'Game is already active. You cannot join an active game',
                });
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

    static async leaveGame(req: Request, res: Response): Promise<any> {
        try {
            const game = await GameService.getPlayerGame(req);

            const googleUser = req.user;

            if (!googleUser || googleUser == undefined)
                res.status(404).json({ message: 'Invalid token' });

            const user = (await UserService.getUserByGoogleId(
                googleUser?.sub ?? ''
            )) as { id: number } | null;

            if (!user) {
                res.status(404).json({ message: 'Invalid token' });
            }

            if (!game)
                return res
                    .status(404)
                    .json({ message: 'Could not find users current game' });

            const result = await GameService.removePlayerFromGame(
                user?.id ?? 0,
                game.id
            );

            return res.status(200).json({
                message: result,
            });

            //handleSuccess(res, result);
        } catch (error) {
            handleFailure(res, error, 'Failed to remove player from game');
        }
    }

    static async getPlayerGame(req: Request, res: Response): Promise<any> {
        try {
            const game = await GameService.getPlayerGame(req);

            handleSuccess(res, GameController.createGameResponse(game));
        } catch (error) {
            handleFailure(res, error, 'Error fetching game');
        }
    }

    static createGameResponse(game: Game | null) {
        if (game == null) return null;

        const gameData = {
            game: game,
            status: GameState[game.gameStatusId],
        };

        return gameData;
    }

    static async getGameScores(req: Request, res: Response): Promise<any> {
        try {
            const game = await GameService.getPlayerGame(req);

            if (!game)
                return res
                    .status(404)
                    .json({ message: 'Could not find users current game' });

            const scores = await GameService.getUsersUpdatedScores(game.id);

            handleSuccess(res, scores);
        } catch (error) {
            handleFailure(res, error, 'Error fetching game scores');
        }
    }
}
