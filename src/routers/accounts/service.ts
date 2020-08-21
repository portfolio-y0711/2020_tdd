import {
    Request,
    Response,
    NextFunction
} from 'express';

import { send_mail } from '../../util/nodemailer';
import { getRepository, ObjectID } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Token } from '../../models/token.entity';

export const send_login_email = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const uid = uuid().toString();
    await getRepository(Token).save({ email: email, uuid: uid });
    const url = `http://localhost:5000/accounts/login?token=${uid}`;
    const message_body = `Use this link to log in: ${url}`;
    send_mail(
        'Your login link for Superlists',
        `${message_body}`,
        'noreply@superlists',
        `${email}`
    );
    res.setHeader('message', 'Check your email, we\'ve sent you a link you can use to log in!');
    res.redirect('/');
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.query;
    const user = await authenticate(token);
    if (user) {
        req.session!.email = user.email;
    }
    req.session!.email = 'no-email';
    res.redirect('/');
};

export const authenticate = async (uuid: any) => {
    return await getRepository(Token).findOne(uuid);
};
