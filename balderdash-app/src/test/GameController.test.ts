import { Response } from 'express';
const request = require('supertest');

require('dotenv').config();

jest.mock('../middleware/auth', () => {
    return jest.fn((req, res, next) => {
        req.user = {
            email: 'test@example.com',
            name: 'Test User',
            picture: 'https://example.com/picture.jpg',
            sub: 'mock-user-id-123',
        };
        next();
    });
});

const { app } = require('../index');

describe('GET /api/games', () => {
    it("should return a player's active game", async () => {
        return request(app)
            .get('/api/games')
            .set('Cookie', ['authorization=mock-token'])
            .send('test')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res: Response) => {
                expect(res.statusCode).toBe(200);
            });
    });
});
