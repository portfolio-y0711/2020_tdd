import { Request } from 'express';
import jwt from 'jsonwebtoken';

import {
    Response,
    NextFunction
} from 'express';


export const authenticate = async (request: Request, response: Response, next: NextFunction) => {
    const cookies = request.cookies;
    if (cookies && cookies.Authorization) {
        const secret = process.env.JWT_SECRET!;
        const verificationResponse = jwt.verify(cookies.Authorization, secret) as { email: any };
        request.session!.email = verificationResponse.email;
        next();
    } else {
        next();
    }
    next();
};