import { Request, Response } from 'express';
import { LeaderboardService } from '../services/LeaderboardService';

export class LeaderboardController {
    static async getLeaderboard(request: Request, response: Response): Promise<void> {
        try {
            const leaderboard = await LeaderboardService.getLeaderboard();
            response.status(200).json(leaderboard);
        } catch (error) {
            console.error(error);
            response.status(500).json({ message: 'Error fetching leaderboard' });
        }
    }

}
