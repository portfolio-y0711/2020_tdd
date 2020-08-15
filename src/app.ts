import express, { NextFunction, Router } from 'express';
import { viewResolver } from './controllers/util';
import { createConnection, getRepository } from 'typeorm';
import { config } from './repositories/typeorm.config';
import cookieParser from 'cookie-parser';
import { Item, List } from './models/entities';
import lusca from 'lusca';
import session from 'express-session';

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
    const start = async () => {
        await init().up();
    };

    const setHandlers = (app: any) => {
        app.use(cookieParser());
        app.use(express.urlencoded({ extended: false }))
        app.use(session({
            secret: 'ssh, don\'t tell!',
            resave: false,
            saveUninitialized: true
        }));
        app.use(lusca({ csrf: true }));
        app.use(express.static(__dirname + '/public'));
    };


    const setRoutes = (app: any) => {
        const listRouter = Router();
        const itemRouter = Router({ mergeParams: true });
        listRouter.use('/lists/:id', itemRouter);

        listRouter.get('/', async (req: any, res: any, next: express.NextFunction) => {
            const result = await viewResolver('/')({ csrfToken: res.locals._csrf });
            res.status(200).send(result);
        });

        listRouter.post('/lists/new', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
            const { item_text } = req.body;
            const new_list = await getRepository(List).save({});
            const item = await getRepository(Item).save({ text: item_text, list: new_list });
            res.status(302).redirect(`/lists/${new_list.id}`);
        });


        listRouter.get('/lists/:id', async (req: express.Request, res: any, next: NextFunction) => {
            const { id: list_of_id_to_find } = req.params;
            const list = await getRepository(List)
                .createQueryBuilder('list')
                .where('list.id=:id', { id: `${list_of_id_to_find}` })
                .getOne();
            if (list) {
                const items = await getRepository(Item)
                    .createQueryBuilder('item')
                    .innerJoin('item.list', 'list')
                    .where('item.list = :id', { id: `${list!.id}` })
                    .getMany();
                const result = await viewResolver('/lists')({ csrfToken: res.locals._csrf, items, id: `${list!.id}` });
                res.send(result);
            } else {
                next(new Error('no user by that name'));
            }
        });

        itemRouter.post('/add_item', async (req: express.Request, res: express.Response, next: NextFunction) => {
            const { id } = req.params;
            const { item_text } = req.body;
            const searched_list = await getRepository(List).findOne(id);
            const { id: listId } = searched_list!;
            await getRepository(Item).save({ text: item_text, list: searched_list });
            res.status(302).redirect(`/lists/${listId}`);
        });

        app.use('/', listRouter);
    };
    return {
        init,
        start
    };
})()

export const app = APP.init().getApp();