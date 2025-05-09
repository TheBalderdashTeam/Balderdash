import express, { NextFunction, Request, Response } from 'express'
import authRoutes from './modules/auth/AuthRoutes'
import roundRoutes from './routes/RoundRoutes'
import path from 'path'

const app = express()
const port = 8080

// Parse JSON bodies (for POST requests, etc.)
app.use(express.json())

// Serve static frontend files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../public')))

app.use(authRoutes)
app.use(roundRoutes)

// Fallback route (SPA support) - serves index.html for all other routes
app.get(/.*/, isAuthenticated, (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/index.html'))
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})

function isAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction
) {
 //   if (request.body) {
        return next()
 //   }
  //  response.redirect('/')

}
