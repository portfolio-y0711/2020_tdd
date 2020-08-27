import { Router } from 'express';
import {
    auth_login,
    callback,
    refresh
} from './service';

export const OauthRouter = (service: any) => {
    const router = Router({ mergeParams: true });
    router.get('/oauth/login', service.auth_login);
    router.get('/oauth/callback', service.callback);
    router.get('/oauth/refresh', service.refresh);
    return router;
};

const oauthRouter = OauthRouter({ auth_login, callback, refresh });

export default oauthRouter;