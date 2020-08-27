import {
    Request,
    Response,
    NextFunction
} from 'express';
import { Token } from '../../../src/models/token.entity';
import { getRepository } from 'typeorm';
import { v4 as uuid } from 'uuid';

export const admin = (req: Request, res: Response, next: NextFunction) => {
    res.send(`
        <h1>Admin Login</h1>
        <form action="/admin/login" method="POST">
            <input type="text" id="pwd" name="pwd" placeholder="Password">
            <input type="hidden" name="_csrf" value="${res.locals._csrf}">
            <button type="submit">Login</button>
        </form>
    `);
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { pwd } = req.body;
    const uid = uuid().toString();
    if (pwd === process.env.ADMIN_PASSWORD) {
        await getRepository(Token).save({ email: 'admin@superlists', uuid: uid });
    }
    res.send(pwd);
};