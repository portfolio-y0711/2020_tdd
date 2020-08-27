import express, {
    Request,
    Response,
    NextFunction
} from 'express';

import jwt from 'jsonwebtoken';
import HttpException from '../../exceptions/http.exception';

import { getRepository } from 'typeorm';
import { Token } from '../../models/token.entity';

export const send_login_email = (options: { mailer: any, gen_token: any }) => async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const { mailer, gen_token } = options;
    const uid = gen_token();
    await getRepository(Token).save({ email: email, uuid: uid });
    const url = `http://localhost:5000/accounts/login?token=${uid}`;
    const message_body = `Use this link to log in: ${url}`;
    mailer.send_mail(
        'Your login link for Superlists',
        `${message_body}`,
        'noreply@superlists',
        `${email}`
    );
    req.session!.message = 'Check your email, we\'ve sent you a link you can use to log in!';
    res.redirect('/');
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.query;
    const user = await emailTokenAuthenticate(token);
    if (user) {
        const tokenData = createWebToken(user);
        req.session!.webToken = tokenData.token;
        req.session!.message = undefined;
        res.cookie('Authorization', tokenData.token);
    } else {
        next(new HttpException(401, 'not authorized to access this page'));
    }
    res.redirect('/');
};

export const logout = async(req: express.Request, res: Response, next: NextFunction) => {
    req.session!.destroy(()=> {
        res.cookie('Authorization', '', { expires: new Date(Date.now() + 1) });
        res.redirect('/');
    });
};

export const emailTokenAuthenticate = async (uuid: any) => {
    return await getRepository(Token).findOne(uuid);
};


interface TokenData {
    token: string;
    expiresIn: number;
  }

const createCookie = (tokenData: TokenData) => {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
};

const createWebToken = (user: Token) => {
    const expiresIn = 60 * 60;
    const secret = process.env.JWT_SECRET!;
    const dataToBeImbedded = {
        email: user.email
    };
    return {
        expiresIn,
        token: jwt.sign(dataToBeImbedded, secret, { expiresIn })
    };
}