import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

export class UserController {
    static async getUser(request: Request, response: Response): Promise<void> {
        try {
            const googleUser = request.user;

            console.log(googleUser);

            if (!googleUser || googleUser == undefined)
                response.status(404).json({ message: 'Invalid token' });

            const user = await UserService.getUserByGoogleId(
                googleUser?.sub ?? ''
            );

            // console.log(user);

            if (!user) response.status(404).json({ message: 'User not found' });
            response.status(200).json(user);
        } catch (error) {
            console.error(error);
            response.status(500).json({ message: 'Error fetching user' });
        }
    }
}
