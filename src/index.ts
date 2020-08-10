import express, { NextFunction } from 'express';
import { resolve } from './util';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import bodyParser from 'body-parser';
import { home_page, MustacheRenderer } from './views';
import { createConnection, Repository } from 'typeorm';
import { config } from '../typeorm.config';

export const app = express();

// app.set('views', './src/views');
// app.engine('mu', (filePath: any, options: any, callback: any) => {
//     const rendered = MustacheRenderer.render(filePath, options);
//     return callback(null, rendered);
// });
// app.set('view engine', 'mu');

// app.use(cookieParser());
// app.use(express.urlencoded({ extended: false }))

const handles = (app: any) => {
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: false }))
}
handles(app);

export const setDBContext = async () => {
    const db = await createConnection(config);
};

// (async () => {
//     await setDBContext();
// })();

export const routes = (app: any) => {
    const router = express.Router();
    const csrfProtection = csrf({ cookie: true });
    let token: any;

    router.get('/', csrfProtection, async (req: any, res: any) => {
        token = req.csrfToken();
        // console.log(token);
        const result = await resolve('/')({ csrfToken: token });
        // const re = new RegExp(/"_csrf"\s+value="(.+)">/);
        // console.log(result);
        // console.log(re.exec(result)![1]);
        res.send(result);
    });

    // router.post('/', csrfProtection, async(req: express.Request, res: any) => {
    //     console.log(req.body);
    //     try{
    //         const result = await (await resolve('/'))(Object.assign({}, req.body, { csrfToken: req.csrfToken() }));
    //         res.send(result);
    //     } catch(e) {
    //         console.log(e);
    //     }
    // });

    router.post('/', function (req: express.Request, res: any, next: NextFunction) {
        if ((req.get('csrf-token')! !== token) && (req.body._csrf !== token)) {
            next(new Error('csrf-error'));
        }
        next();
    }, (err: any, req: any, res: any, next: NextFunction) => {
        res.status(401).send('unauthorized');
    }, async (req: any, res: express.Response) => {
        const result = await (await resolve('/'))(Object.assign({}, req.body, { csrfToken: token }));
        res.status(302).redirect('/');
    });

    app.use('/', router);
};

routes(app);


// app.listen(5000, () => {
//     console.log('server is running at 5000');
// });

