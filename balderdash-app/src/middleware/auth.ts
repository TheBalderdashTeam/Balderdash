import { Request, Response, NextFunction } from 'express';
import { verifyGoogleToken } from '../utils/verifyJwt';
import { GooglePayload } from '../types/GoolePayload';

declare global {
    namespace Express {
        interface Request {
            user?: GooglePayload;
        }
    }
}

const auth = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const token = request.cookies.authorization;
    if (!token)
        return response
            .status(401)
            .json({ error: 'Access denied. No token provided.' });

    try {
        const user = await verifyGoogleToken(token);
        request.user = user;
        next();
    } catch (error) {
        console.log(error);
        response.status(401).json({ error: 'Invalid Token' });
    }
};

module.exports = auth;
