import express, { NextFunction, Request, Response } from 'express';
import authRoutes from './routes/AuthRoutes';
import userRoutes from './routes/UserRoutes';
import roundRoutes from './routes/RoundRoutes';
import gameRoutes from './routes/GameRoutes';
import voteRoutes from './routes/VoteRoutes';
import leaderboardRoutes from './routes/LeaderboardRoutes';

import path from 'path';
import { GooglePayload } from './types/GoolePayload';

declare global {
    namespace Express {
        interface Request {
            user?: GooglePayload;
        }
    }
}

const app = express();
const port = 8080;

// Serve static files (like index.html)
app.use(express.json());

app.use(authRoutes);

app.use('/api', userRoutes);

app.use('/api', roundRoutes);
app.use('/api', leaderboardRoutes);

app.use('/api', gameRoutes);

app.use('/api', voteRoutes);

app.use(express.static(path.join(__dirname, '../public')));

app.use('/api', roundRoutes);

// Fallback route (SPA support) - serves index.html for all other routes
app.get(/.*/, (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
