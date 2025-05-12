import express, { Request, Response, Router } from 'express';
import authService from '../services/AuthService';
require('dotenv').config();

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

        response.redirect(`http://ec2-13-247-204-202.af-south-1.compute.amazonaws.com/login?code=${encodeURI(code)}`);
    }
);

router.get(
    '/login',
    async (request: Request, response: Response): Promise<any> => {
        const token = await authService.login(request, response);

        response.cookie('authorization', token ?? '', {
          httpOnly: true,
          secure: false,
          path: '/'
        });

        response.redirect('/home');
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
