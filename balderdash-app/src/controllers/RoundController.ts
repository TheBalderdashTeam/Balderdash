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
}
