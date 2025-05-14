import sql from '../configuration/DatabaseConfig';
import { User } from '../types/User';

export class UserRepository {
    static async createUser(
        googleId: string,
        email: string,
        username: string
    ): Promise<User> {
        const [userRow] = await sql`
      INSERT INTO users (google_id, email, username)
      VALUES (${googleId}, ${email}, ${username})
      RETURNING id, google_id, email, username;
    `;
        return this.mapToUser(userRow);
    }

    static async getUserById(userId: number): Promise<User | null> {
        const users = await sql`
      SELECT id, google_id, email, username FROM users WHERE id = ${userId};
    `;
        const userRow = users[0];
        return userRow ? this.mapToUser(userRow) : null;
    }

    static async getUserByGoogleId(googleId: string): Promise<User | null> {
        const userDetails = await sql`
      SELECT id, google_id, email, username FROM users WHERE google_id = ${googleId};
    `;
        const userRow = userDetails[0];
        return userRow ? this.mapToUser(userRow) : null;
    }

    static async getUserByEmail(email: string): Promise<User | null> {
        const userDetails = await sql`
      SELECT id, google_id, email, username FROM users WHERE email = ${email};
    `;
        const userRow = userDetails[0];
        return userRow ? this.mapToUser(userRow) : null;
    }

    static async getAllUsers(): Promise<User[]> {
        const users = await sql`
      SELECT id, google_id, email, username FROM users;
    `;
        return users.map(this.mapToUser);
    }

    static async updateUsername(
        userId: number,
        newUsername: string
    ): Promise<User | null> {
        const userDetails = await sql`
      UPDATE users SET username = ${newUsername} WHERE id = ${userId} RETURNING id, google_id, email, username;
    `;
        const userRow = userDetails[0];
        return userRow ? this.mapToUser(userRow) : null;
    }

    static async deleteUser(userId: number): Promise<void> {
        await sql`
      DELETE FROM users WHERE id = ${userId};
    `;
    }

    static async getPlayersGameById(gameId: number): Promise<User[] | null> {
        const users = await sql`
        SELECT u.id, u.google_id, u.email, u.username
        FROM users u
        JOIN game_players gp ON u.id = gp.user_id
        WHERE gp.game_id = ${gameId};
    `;

        return users.map(this.mapToUser);
    }

    private static mapToUser(row: any): User {
        return {
            id: row.id,
            email: row.email,
            googleId: row.google_id,
            username: row.username,
        };
    }
}
