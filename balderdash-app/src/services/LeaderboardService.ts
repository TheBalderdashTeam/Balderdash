import { LeaderboardRepository } from '../repositories/LeaderboardRepository';


export class LeaderboardService {
  static async getLeaderboard()
  {
    return await LeaderboardRepository.getLeaderboard();
  }
}