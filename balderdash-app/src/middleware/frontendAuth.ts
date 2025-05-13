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

export const frontendAuth = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const token = request.cookies.authorization;
    if (!token) {
        return response.redirect('/sign-in'); 
    }

    try {
        const user = await verifyGoogleToken(token);
        request.user = user;
        next();
    } catch (error) {

      response.redirect('/sign-in');
    }
};