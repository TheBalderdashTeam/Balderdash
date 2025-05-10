import { Request, Response } from 'express';
import { RoundService } from '../services/RoundService';
import { Round } from '../types/Round';
import { GameService } from '../services/GameService';
import { UserService } from '../services/UserService';

export class RoundController {
    static async getCurrentRound(req: Request, res: Response): Promise<void> {
        try {
            const game = await GameService.getPlayerGame(req);

            if (!game) {
                res.status(400).json({ error: 'Invalid gameId' });
            }

            const roundData = await RoundService.getCurrentRound(game?.id ?? 0);

            if (!roundData) {
                res.status(404).json({ error: 'No active round found' });
            }

            res.json(roundData);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to get current round' });
        }
    }

    static async endRound(req: Request, res: Response): Promise<void> {
        try {
            const gameId = Number(req.params.gameId);

            if (isNaN(gameId)) {
                res.status(400).json({ error: 'Invalid gameId' });
                return;
            }

            const result = await RoundService.endRoundAndCalculateScores(
                gameId
            );

            res.json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to end round' });
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
            res.status(200).json(roundDefinition);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Error creating round definition',
            });
        }
    }
}
