import { GameService } from '../services/GameService';
import { RoundService } from '../services/RoundService';
import { UserService } from '../services/UserService';
import { RoundState } from '../types/RoundState';

export const checkRoundState = async (roundId: number) => {
    const game = await GameService.getGameByRoundId(roundId);

    if (!game) return null;

    const players = await UserService.getAllPlayersInGame(game.id);

    if (!players) return null;

    const playerCount = players.length;

    const definitions = await RoundService.getCurrentRound(game.id);

    if (!definitions) return null;

    const definitionCount = definitions.definitions.length;

    if (definitionCount >= playerCount) {
        RoundService.updateRoundState(roundId, RoundState.Scoring);
        RoundService.endRoundAndCalculateScores(game.id);
    }
};
