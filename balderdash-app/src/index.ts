import express, { NextFunction, Request, Response } from 'express'
import authRoutes from './modules/auth/AuthRoutes'
import roundRoutes from './routes/RoundRoutes'
import gameRoutes from './routes/GameRoutes'
import voteRoutes from './routes/VoteRoutes'
import path from 'path'

const app = express()
const port = 8080


// Serve static files (like index.html)
app.use(express.json());

app.use(authRoutes)

app.use(roundRoutes)

app.use(gameRoutes)

app.use(voteRoutes)

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
