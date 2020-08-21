import express from 'express';
import { createConnection } from 'typeorm';
import { config } from './repositories/typeorm.config';
import cookieParser from 'cookie-parser';
import lusca from 'lusca';
import session from 'express-session';

const FileStore = require('session-file-store')(session);

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
            saveUninitialized: true,
            store: new FileStore()
        }));
        app.use(lusca({ csrf: true }));
        app.use(express.static(__dirname + '/public'));
    };


    const setRoutes = (app: any) => {
        app.use('/', require('./routers').default);
    };

    return {
        init,
        start
    };
})()

export const app = APP.init().getApp();
