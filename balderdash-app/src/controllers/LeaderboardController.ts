import { Request, Response } from 'express';
import { LeaderboardService } from '../services/LeaderboardService';
import {handleSuccess, handleFailure} from '../utils/handleResponses';

export class LeaderboardController {
    static async getLeaderboard(req: Request, res: Response): Promise<void> {
        try {
            const leaderboard = await LeaderboardService.getLeaderboard();
            handleSuccess(res, leaderboard);
        } catch (error) {
            handleFailure(res, error, 'Error fetching leaderboard');
        }
    }

}
