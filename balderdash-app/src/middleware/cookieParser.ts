import { Request, Response, NextFunction } from 'express';

declare module 'express-serve-static-core' {
    interface Request {
        cookies: any;
    }
}

export function simpleCookieParser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const cookieHeader = req.headers.cookie;
    req.cookies = {};
    if (cookieHeader) {
        cookieHeader.split(';').forEach((cookie) => {
            const [name, ...rest] = cookie.trim().split('=');
            req.cookies[name] = decodeURIComponent(rest.join('='));
        });
    }
    console.log('Cookies:', req.cookies);
    next();
}
