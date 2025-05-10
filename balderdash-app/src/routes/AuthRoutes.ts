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
        //Make this hit the backend login url
        const url = new URL('http://localhost:8080/login');
        url.searchParams.append('code', code);

        response.redirect(url.href);
    }
);

router.get(
    '/login',
    async (request: Request, response: Response): Promise<any> => {
        const token = await authService.login(request, response);
        response.setHeader('authorisation', token ?? '');
        response.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Authentication Successful</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            max-width: 800px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        h1 {
                            color: #4285f4;
                        }
                        .token-container {
                            background-color: #f5f5f5;
                            border: 1px solid #ddd;
                            border-radius: 4px;
                            padding: 15px;
                            margin: 20px 0;
                            word-break: break-all;
                            overflow-x: auto;
                        }
                        button {
                            background-color: #4285f4;
                            color: white;
                            border: none;
                            padding: 10px 15px;
                            border-radius: 4px;
                            cursor: pointer;
                        }
                        button:hover {
                            background-color: #3367d6;
                        }
                    </style>
                </head>
                <body>
                    <h1>Authentication Successful</h1>
                    <p>Your JWT token is:</p>
                    <div class="token-container">
                        <code>${token}</code>
                    </div>
                    <p>
                        <button onclick="copyToClipboard()">Copy Token</button>
                    </p>
                    
                    <script>
                        function copyToClipboard() {
                            const tokenText = document.querySelector('code').innerText;
                            navigator.clipboard.writeText(tokenText)
                                .then(() => {
                                    alert('Token copied to clipboard!');
                                })
                                .catch(err => {
                                    console.error('Failed to copy: ', err);
                                    // Fallback for browsers that don't support clipboard API
                                    const textarea = document.createElement('textarea');
                                    textarea.value = tokenText;
                                    document.body.appendChild(textarea);
                                    textarea.select();
                                    document.execCommand('copy');
                                    document.body.removeChild(textarea);
                                    alert('Token copied to clipboard!');
                                });
                        }
                    </script>
                </body>
                </html>
            `);
    }
);

// Logout route
router.get('/logout', (request: Request, response: Response) => {
    response.redirect('/login');
});

export default router;
