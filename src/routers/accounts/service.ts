import {
    Request,
    Response,
    NextFunction
} from 'express';

import { send_mail } from '../../util/nodemailer';
import { getRepository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Token } from '../../models/token.entity';

export const send_login_email = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const uid = uuid().toString();
    getRepository(Token).create({ email: email, uuid: uid });
    const url = `http://localhost:5000/accounts/login?uid=${uid}`;
    send_mail('subject', `Your login link for Superlists. Use this link to log in. ${url}`, 'from@example.com', 'to@example.com');
    console.log('email sent');
    res.send(`Your login link for Superlists. Use this link to log in. ${url}`);
    res.redirect('/');
};