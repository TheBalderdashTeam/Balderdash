import { Request, Response } from 'express';
import { RoundService } from '../services/RoundService';
import { Round } from '../types/Round';

export class RoundController {
    static async getCurrentRound(req: Request, res: Response): Promise<void> {
        try {
            const gameId = Number(req.params.gameId);

            if (isNaN(gameId)) {
                res.status(400).json({ error: 'Invalid gameId' });
            }

            const roundData = await RoundService.getCurrentRound(gameId);

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

      const result = await RoundService.endRoundAndCalculateScores(gameId);

      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to end round' });
    }
  }

    static async createRoundDefinition(
        request: Request,
        response: Response
    ): Promise<void> {
        try {
            console.log(request.body);
            const { roundId, userId, definition, wordId } = request.body;

            const roundDefinition = await RoundService.createRoundDefinition(
                roundId,
                userId,
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
