import { GameRepository } from '../repositories/GameRepository';
import { UserRepository } from '../repositories/UserRepository';
import { GooglePayload } from '../types/GoolePayload';
import { User } from '../types/User';

export class UserService {
    static async createUser(
        googleId: string,
        email: string,
        username: string
    ): Promise<User | null> {
        const normalisedUsername = username.split(' ').join('');

        return await UserRepository.createUser(
            googleId,
            email,
            normalisedUsername
        );
    }

    static async getUser(
        googleUser: GooglePayload | undefined
    ): Promise<User | null> {
        if (!googleUser) return null;

        const user = await this.getUserByGoogleId(googleUser.sub);

        return user;
    }

    static async getUserByGoogleId(googleId: string): Promise<User | null> {
        return await UserRepository.getUserByGoogleId(googleId);
    }

    static async getAllPlayersInGame(gameId: number): Promise<User[] | null> {
        try {
            return await UserRepository.getPlayersGameById(gameId);
        } catch {
            return null;
        }
    }
}
