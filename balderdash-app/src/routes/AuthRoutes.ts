import express, { Request, Response, Router } from 'express';
import authService from '../services/AuthService';
import { UserService } from '../services/UserService';
import { SendUserToSite } from '../utils/sendUserToSite';
require('dotenv').config();
const auth = require('../middleware/auth');

const router: Router = express.Router();

// Google OAuth login route -- will be used on the frontend
router.get('/auth/google', (request: Request, response: Response) => {
    var clientId = process.env.CLIENT_ID;
    var redirectUri = process.env.REDIRECT_URI;
    if (!!clientId && !!redirectUri) {
        const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        url.searchParams.append('client_id', clientId);
        url.searchParams.append('redirect_uri', redirectUri);
        url.searchParams.append('response_type', 'code');
        url.searchParams.append('scope', 'profile email');
        response.redirect(url.href);
    }
});

// OAuth callback route -- will be used on the frontend, and then pass the code to the backend login
router.get(
    '/auth/google/callback',
    async (request: Request, response: Response) => {
        const { code } = request.query;

        if (!code || typeof code !== 'string') {
            return;
        }

        response.redirect(
            `http://localhost:8080/login?code=${encodeURI(code)}`
        );
    }
);

router.get('/login', async (req: Request, res: Response): Promise<any> => {
    const token = await authService.login(req, res);

    res.cookie('authorization', token ?? '', {
        httpOnly: true,
        secure: false,
        path: '/',
    });

    res.redirect('/place-user');
});

router.get(
    '/place-user',
    auth,
    async (req: Request, res: Response): Promise<any> => {
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        SendUserToSite(req.user, res);
    }
);

// Logout route
router.get('/logout', (request: Request, response: Response) => {
    response.clearCookie('authorization', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
    });

    response.status(200).json({ message: 'Logged out successfully' });
});

export default router;
