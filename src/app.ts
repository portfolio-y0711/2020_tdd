import express, { NextFunction } from 'express';
import { viewResolver } from './controllers/util';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import { createConnection, getRepository } from 'typeorm';
import { config } from '../typeorm.config';
import { register } from 'ts-node';
import { Item } from './models/item.entity';

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

        router.get('/lists/the-only-list-in-the-world', csrfProtection, async (req: any, res: any) => {
            token = req.csrfToken();
            const resolve = viewResolver('/lists/the-only-list-in-the-world');
            const result = await resolve({ csrfToken: token });
            res.send(result);
        });

        router.post('/lists/new', function (req: express.Request, res: any, next: NextFunction) {
            if ((req.get('csrf-token')! !== token) && (req.body._csrf !== token)) {
                next(new Error('csrf-error'));
            }
            next();
        }, (err: any, req: any, res: any, next: NextFunction) => {
            res.status(401).send('unauthorized');
            throw(err);
        }, async (req: express.Request, res: express.Response) => {
            const { item_text } = req.body;
            const repo = getRepository(Item);
            const item = repo.create({ text: item_text });
            await repo.save(item);
            // const resolve = viewResolver('/lists/new');
            // const result = await resolve(Object.assign({}, req.body, { csrfToken: token }));
            res.status(302).redirect('/lists/the-only-list-in-the-world');
        });
        
        router.get('/', csrfProtection, async (req: any, res: any) => {
            token = req.csrfToken();
            const result = await viewResolver('/')({ csrfToken: token });
            res.send(result);
        });

        // router.post('/', function (req: express.Request, res: any, next: NextFunction) {
        //     if ((req.get('csrf-token')! !== token) && (req.body._csrf !== token)) {
        //         next(new Error('csrf-error'));
        //     }
        //     next();
        // }, (err: any, req: any, res: any, next: NextFunction) => {
        //     res.status(401).send('unauthorized');
        //     throw(err);
        // }, async (req: any, res: express.Response) => {
        //     const result = await (await getResolver('/'))(Object.assign({}, req.body, { csrfToken: token }));
        //     res.status(302).redirect('/lists/the-only-list-in-the-world');
        // });

        app.use('/', router);
    };
    return {
        init,
        start
    };
})()

export const app = APP.init().getApp();