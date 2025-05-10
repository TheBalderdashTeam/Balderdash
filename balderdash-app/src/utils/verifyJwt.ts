import { Request, Response, NextFunction } from 'express';
import jwt, { Algorithm } from 'jsonwebtoken';
import https from 'https';
import { GooglePayload } from '../types/GoolePayload';
require('dotenv').config();

interface GoogleCerts {
    [key: string]: string;
}

let googleCerts: GoogleCerts = {};
let lastCertFetch = 0;

const fetchGoogleCerts = (): Promise<GoogleCerts> => {
    return new Promise((resolve, reject) => {
        const now = Date.now();
        if (
            Object.keys(googleCerts).length > 0 &&
            now - lastCertFetch < 12 * 60 * 60 * 1000
        ) {
            return resolve(googleCerts);
        }

        https
            .get('https://www.googleapis.com/oauth2/v1/certs', (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    try {
                        googleCerts = JSON.parse(data);
                        lastCertFetch = now;
                        resolve(googleCerts);
                    } catch (err) {
                        reject(
                            new Error('Failed to parse Google certificates')
                        );
                    }
                });
            })
            .on('error', (err) => {
                reject(err);
            });
    });
};

export const verifyGoogleToken = async (
    token: string
): Promise<GooglePayload> => {
    try {
        const header = JSON.parse(
            Buffer.from(token.split('.')[0], 'base64').toString()
        );
        const kid = header.kid;

        const certs = await fetchGoogleCerts();

        if (!certs[kid]) {
            throw new Error('Invalid certificate key ID');
        }

        const publicKey = certs[kid];

        // Verify options
        const verifyOptions = {
            algorithms: ['RS256' as Algorithm],
            issuer: ['accounts.google.com', 'https://accounts.google.com'],

            audience: process.env.CLIENT_ID,
        };

        // Verify token
        const payload = jwt.verify(
            token,
            publicKey,
            verifyOptions
        ) as unknown as GooglePayload;

        // Add any additional validation here if needed
        if (!payload.email_verified) {
            throw new Error('Email not verified by Google');
        }

        return payload;
    } catch (error) {
        console.log(error);
        throw new Error(`Token verification failed: ${error}`);
    }
};
