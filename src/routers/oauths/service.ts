import {
    Request,
    Response,
    NextFunction,
} from 'express';

import {
    getToken,
    url,
    oauth2Client
} from '../../util/googleApi';

export const auth_login = async (req: Request, res: Response, next: NextFunction) => {
    res.send(`<a href='${url}'>인증하기</a>`);
};

export const callback = async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.query;
    const token = await getToken(code);
    res.redirect('/');
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
    console.log(await oauth2Client.getAccessToken());
    res.send('ok');
};