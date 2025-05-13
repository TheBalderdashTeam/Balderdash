import { Request, Response, NextFunction } from 'express';

const mockAuth = (req: Request, res: Response, next: NextFunction) => {
    req.user = {
        email: 'test@example.com',
        name: 'Test User',
        picture: 'https://example.com/picture.jpg',
        sub: 'mock-user-id-123',
    };

    next();
};

module.exports = mockAuth;
