import express, { Request, Response, Router } from 'express'
import authService from './AuthService'
require('dotenv').config()

const router: Router = express.Router()

// Google OAuth login route -- will be used on the frontend
router.get('/auth/google', (request: Request, response: Response) => {
    var clientId = process.env.CLIENT_ID
    var redirectUri = process.env.REDIRECT_URI

    if (!!clientId && !!redirectUri) {
        console.debug(clientId)
        const url = new URL('https://accounts.google.com/o/oauth2/v2/auth')
        url.searchParams.append('client_id', clientId)
        url.searchParams.append('redirect_uri', redirectUri)
        url.searchParams.append('response_type', 'token')
        url.searchParams.append('scope', 'profile email')

        console.debug(url)
        response.redirect(url.href)
    }
})

// OAuth callback route -- will be used on the frontend, but just the first part to extract the code
router.get(
    '/auth/google/callback',
    async (request: Request, response: Response) => {
        authService.login(request, response)
    }
)

// Logout route
router.get('/logout', (request: Request, response: Response) => {
    response.redirect('/login')
})

module.exports = router
