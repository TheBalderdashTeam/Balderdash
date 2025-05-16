import { LeaderboardRepository } from '../repositories/LeaderboardRepository';

export class LeaderboardService {
    static async getLeaderboard() {
        const scores = await LeaderboardRepository.getLeaderboard();

        scores.map((score) => {
            if (score.totalScore === null || score.totalScore === undefined)
                score.totalScore = 0;
        });

        return scores;
    }
}
