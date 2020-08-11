import express, { NextFunction } from 'express';
import { resolve } from './util';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import bodyParser from 'body-parser';
import { home_page, MustacheRenderer } from './views';
import { createConnection, Repository } from 'typeorm';
import { config } from '../typeorm.config';

export const APP = (() => {
    const init = (() => {
        const createDbContext = async () => {
            await createConnection(config);
        };
        const up = async () => {
                await createDbContext();
                server.listen(5000, () => {
                console.log('server is running at 5000');
            });
        }
        const server = express();
        const getApp = () => server;

        setHandlers(server);
        setRoutes(server);
        return {
            getApp,
            up,
        };
    });
    const start = async() => {
        await init().up();
    };

    const setHandlers = (app: any) => {
        app.use(cookieParser());
        app.use(express.urlencoded({ extended: false }))
    };


    const setRoutes = (app: any) => {
        const router = express.Router();
        const csrfProtection = csrf({ cookie: true });
        let token: any;

        router.get('/', csrfProtection, async (req: any, res: any) => {
            token = req.csrfToken();
            const result = await resolve('/')({ csrfToken: token });
            res.send(result);
        });

        router.post('/', function (req: express.Request, res: any, next: NextFunction) {
            if ((req.get('csrf-token')! !== token) && (req.body._csrf !== token)) {
                next(new Error('csrf-error'));
            }
            next();
        }, (err: any, req: any, res: any, next: NextFunction) => {
            // res.status(401).send({status: 401, message: 'unauthorized', type: 'csrf error'});
            res.status(401).send('unauthorized');
            throw(err);
        }, async (req: any, res: express.Response) => {
            const result = await (await resolve('/'))(Object.assign({}, req.body, { csrfToken: token }));
            res.status(302).redirect('/');
        });

        app.use('/', router);
    };
    return {
        init,
        start
    };
})()

export const app = APP.init().getApp();