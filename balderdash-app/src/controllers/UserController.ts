import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { GameService } from '../services/GameService';
import { handleFailure, handleSuccess } from '../utils/handleResponses';

export class UserController {
    static async getUser(request: Request, response: Response): Promise<void> {
        try {
            const googleUser = request.user;

            if (!googleUser || googleUser == undefined)
                response.status(404).json({ message: 'Invalid token' });

            const user = await UserService.getUserByGoogleId(
                googleUser?.sub ?? ''
            );

            handleSuccess(response, user);
        } catch (error) {
            handleFailure(response, error, 'Error fetching user');
        }
    }

    static async getAllGamePlayers(req: Request, res: Response): Promise<any> {
        try {
            const game = await GameService.getPlayerGame(req);

            if (!game)
                return res
                    .status(404)
                    .json({ message: 'Could not find users current game' });

            const usersInGame = await UserService.getAllPlayersInGame(game.id);

            handleSuccess(res, usersInGame);
        } catch (error) {
            handleFailure(res, error, 'Error fetching game');
        }
    }
}
