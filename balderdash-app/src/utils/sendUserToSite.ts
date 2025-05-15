import { Response } from 'express';
import { GameService } from '../services/GameService';
import { GameState } from '../types/GameState';
import { RoundService } from '../services/RoundService';
import { RoundState } from '../types/RoundState';
import { GooglePayload } from '../types/GoolePayload';

export const SendUserToSite = async (user: GooglePayload, res: Response) => {
    const game = await GameService.getGameFromGoogleUser(user);
    if (!game) {
        res.redirect('/home');
        return;
    }

    if (game.gameStatusId === GameState.Pending) {
        res.redirect('/lobby');
    }

    if (game.gameStatusId === GameState.Active) {
        const round = await RoundService.getCurrentRound(game.id);

        if (!round) {
            res.redirect('/home');
            return;
        }

        switch (round.roundStatusId) {
            case RoundState.Writing:
                res.redirect('/submit-definition');
                break;
            case RoundState.Voting:
                res.redirect('/game');
                break;
            case RoundState.Scoring:
                res.redirect('/results');
                break;
            default:
                res.redirect('/home');
        }
        return;
    }
    res.redirect('/home');
};
