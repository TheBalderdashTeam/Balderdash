import { Request, Response } from 'express';
import { UserService } from './UserService';
import { User } from '../types/User';
import { GoogleProfile } from '../types/GoogleProfile';
require('dotenv').config();

class AuthService {
    async login(request: Request, response: Response): Promise<string | null> {
        const { code } = request.query;
        if (!code || typeof code !== 'string') {
            return null;
        }

        // Get access token
        try {
            const tokenResponse = await fetch(
                'https://oauth2.googleapis.com/token',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        client_id: process.env.CLIENT_ID,
                        client_secret: process.env.CLIENT_SECRET,
                        code,
                        redirect_uri: process.env.REDIRECT_URI,
                        grant_type: 'authorization_code',
                    }),
                }
            );

            if (!tokenResponse.ok) {
                throw new Error(
                    `Token request failed: ${tokenResponse.statusText}`
                );
            }

            const tokenData = (await tokenResponse.json()) as {
                access_token: string;
                id_token: string;
            };
            const { access_token, id_token } = tokenData;

            // Use access_token to fetch user profile
            const profileResponse = await fetch(
                'https://www.googleapis.com/oauth2/v1/userinfo',
                {
                    headers: { Authorization: `Bearer ${access_token}` },
                }
            );

            if (!profileResponse.ok) {
                throw new Error(
                    `Profile request failed: ${profileResponse.statusText}`
                );
            }

            const profile: GoogleProfile = await profileResponse.json();

            let user = await UserService.getUserByGoogleId(profile.id);
            if (!user) {
                user = await UserService.createUser(
                    profile.id,
                    profile.email,
                    profile.name
                );
            }

            return id_token;
        } catch (error) {
            console.error(
                'Error:',
                error instanceof Error ? error.message : 'Unknown error'
            );
            return null;
        }
    }
}

const authService = new AuthService();
export default authService;
