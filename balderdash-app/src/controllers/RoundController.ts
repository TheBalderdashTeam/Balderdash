import { Request, Response } from 'express';
import { RoundService } from '../services/RoundService';
import { Round } from '../types/Round';
import { GameService } from '../services/GameService';
import { UserService } from '../services/UserService';
import { handleFailure, handleSuccess } from '../utils/handleResponses';

export class RoundController {
    static async getCurrentRound(req: Request, res: Response): Promise<void> {
        try {
            const game = await GameService.getPlayerGame(req);

            if (!game) {
                res.status(400).json({ error: 'Invalid gameId' });
            }

            const roundData = await RoundService.getCurrentRound(game?.id ?? 0);

            handleSuccess(res, roundData);
        } catch (err) {
            handleFailure(res, err, 'Failed to get current round');
        }
    }

    static async getRoundScores(req: Request, res: Response): Promise<void> {
        try {
            const game = await GameService.getPlayerGame(req);

            if (!game) res.status(500).json({ message: 'Failed to end round' });

            const result = await GameService.getUsersUpdatedScores(
                game?.id ?? 0
            );

            handleSuccess(res, result);
        } catch (err) {
            handleFailure(res, err, 'Failed to end round');
        }
    }

    static async createRoundDefinition(
        req: Request,
        res: Response
    ): Promise<void> {
        try {
            const { definition } = req.body;

            const googleUser = req.user;

            if (!googleUser || googleUser == undefined)
                res.status(404).json({ message: 'Invalid token' });

            const user = await UserService.getUserByGoogleId(
                googleUser?.sub ?? ''
            );

            const game = await GameService.getPlayerGame(req);

            if (!game)
                res.status(500).json({ message: 'Player not in active game' });

            const roundData = await RoundService.getCurrentRound(game?.id ?? 0);

            if (!roundData) {
                res.status(404).json({ error: 'No active round found' });
            }

            const roundDefinition = await RoundService.createRoundDefinition(
                roundData?.roundId ?? 0,
                user?.id ?? 0,
                definition,
                roundData?.word.id ?? 0
            );
            handleSuccess(res, roundDefinition);
        } catch (error) {
            handleFailure(res, error, 'Error creating round definition');
        }
    }
}
