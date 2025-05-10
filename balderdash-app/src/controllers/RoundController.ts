import { Request, Response } from 'express';
import { RoundService } from '../services/RoundService';

export class RoundController {
    static async getCurrentRound(req: Request, res: Response): Promise<any> {
        try {
            const gameId = Number(req.params.gameId);

            if (isNaN(gameId)) {
                return res.status(400).json({ error: 'Invalid gameId' });
            }

            const roundData = await RoundService.getCurrentRound(gameId);

            if (!roundData) {
                return res.status(404).json({ error: 'No active round found' });
            }

            res.json(roundData);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to get current round' });
        }
    }

    static async createRoundDefinition(
        request: Request,
        response: Response
    ): Promise<void> {
        try {
            const { roundId, playerId, definition, wordId } = request.body;

            const roundDefinition = await RoundService.createRoundDefinition(
                roundId,
                playerId,
                definition,
                wordId
            );
            response.status(200).json(roundDefinition);
        } catch (error) {
            console.error(error);
            response
                .status(500)
                .json({ message: 'Error creating round definition' });
        }
    }
}
