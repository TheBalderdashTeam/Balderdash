import sql from '../configuration/DatabaseConfig';

export class UserRepository {

    static async createUser(googleId: string, email: string, username: string): Promise<User> {
        const [userRow] = await sql`
      INSERT INTO users (google_id, email, username)
      VALUES (${googleId}, ${email}, ${username})
      RETURNING google_id, email, username;
    `;

        const user: User =
        {
            id: userRow.id,
            email: userRow.email,
            googleId: userRow.google_id,
            username: userRow.username
        }

        return user;
    }

    static async getUserById(userId: number): Promise<User | null> {
        const users = await sql`
    SELECT id, google_id, email, username FROM users WHERE id = ${userId};
  `;

        const userRow = users[0];

        if (!userRow) {
            return null;
        }

        const user: User = {
            id: userRow.id,
            email: userRow.email,
            googleId: userRow.google_id,
            username: userRow.username,
        };

        return user;
    }


    static async getUserByGoogleId(googleId: string): Promise<User | null> {
        const userDetails = await sql`
      SELECT id, google_id, email, username FROM users WHERE google_id = ${googleId};
    `;
        const userRow = userDetails[0];

        if (!userRow) {
            return null;
        }

        const user: User = {
            id: userRow.id,
            email: userRow.email,
            googleId: userRow.google_id,
            username: userRow.username,
        };

        return user;
    }

    static async getUserByEmail(email: string): Promise<User | null> {
        const userDetails = await sql`
      SELECT id, google_id, email, username FROM users WHERE email = ${email};
    `;
        const userRow = userDetails[0];

        if (!userRow) {
            return null;
        }

        const user: User = {
            id: userRow.id,
            email: userRow.email,
            googleId: userRow.google_id,
            username: userRow.username,
        };

        return user;
    }

    static async getAllUsers(): Promise<User | null> {
        const users = await sql`
      SELECT id, google_id, email, username FROM users;
    `;
        const userRow = users[0];

        if (!userRow) {
            return null;
        }

        const user: User = {
            id: userRow.id,
            email: userRow.email,
            googleId: userRow.google_id,
            username: userRow.username,
        };

        return user;
    }

    static async updateUsername(userId: number, newUsername: string): Promise<User | null> {
        const userDetails = await sql`
      UPDATE users SET username = ${newUsername} WHERE id = ${userId} RETURNING id, google_id, email, username;
    `;
        const userRow = userDetails[0];

        if (!userRow) {
            return null;
        }

        const user: User = {
            id: userRow.id,
            email: userRow.email,
            googleId: userRow.google_id,
            username: userRow.username,
        };
        return user;
    }

    static async deleteUser(userId: number) {
        await sql`
      DELETE FROM users WHERE id = ${userId};
    `;
    }

}