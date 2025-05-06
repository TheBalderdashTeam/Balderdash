import { Request, Response } from 'express'
require('dotenv').config()

interface TokenData {
    access_token: string
    id_token: string
    refresh_token?: string
    expires_in?: number
}

class AuthService {
    async login(request: Request, response: Response) {
        const { token } = request.query

        console.debug(request)

        if (!token || typeof token !== 'string') {
            return response.status(400).send('Authorization token is missing')
        }

        // Get access token
        try {
            // Using node-fetch for HTTP requests
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
                        token,
                        redirect_uri: process.env.REDIRECT_URI,
                        grant_type: 'authorization_code',
                    }),
                }
            )

            if (!tokenResponse.ok) {
                throw new Error(
                    `Token request failed: ${tokenResponse.statusText}`
                )
            }

            const tokenData = (await tokenResponse.json()) as {
                access_token: string
                id_token: string
            }
            const { access_token, id_token } = tokenData

            // Use access_token to fetch user profile
            const profileResponse = await fetch(
                'https://www.googleapis.com/oauth2/v1/userinfo',
                {
                    headers: { Authorization: `Bearer ${access_token}` },
                }
            )

            if (!profileResponse.ok) {
                throw new Error(
                    `Profile request failed: ${profileResponse.statusText}`
                )
            }

            const profile = await profileResponse.json()

            console.debug(profile)

            // Code to handle user authentication and retrieval using the profile data
            // Example:
            // req.session.user = profile;

            response.redirect('/')
        } catch (error) {
            console.error(
                'Error:',
                error instanceof Error ? error.message : 'Unknown error'
            )
            response.redirect('/login')
        }
    }
}

const authService = new AuthService()
export default authService
