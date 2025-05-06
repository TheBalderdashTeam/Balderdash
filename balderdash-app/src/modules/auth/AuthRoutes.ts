import express, { Request, Response, Router } from 'express'
require('dotenv').config()

const router: Router = express.Router()
const { authService } = require('./AuthService')

// Google OAuth login route -- will be used on the frontend
router.get('/auth/google', (request: Request, response: Response) => {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=profile email`
    response.redirect(url)
})

// OAuth callback route -- will be used on the frontend, but just the first part to extract the code
router.get(
    '/auth/google/callback',
    async (request: Request, response: Response) => {
        authService.login(request, response)
    }
)

// Logout route
router.get('/logout', (req: Request, res: Response) => {
    res.redirect('/login')
})

module.exports = router
