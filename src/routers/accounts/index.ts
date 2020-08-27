import {
    Router
} from 'express';
import { send_login_email, login, logout } from './service';
import { mailer } from '../../../src/util/nodemail';
import { gen_token } from '../../../src/util/gen_token';

export const AccountRouter = (service: any) => {
    const router = Router({ mergeParams: true });
    router.post('/accounts/send_login_email', service.send_login_email);
    router.get('/accounts/login', service.login);
    router.get('/accounts/logout', service.logout);
    return router;
};


const accountRouter = AccountRouter({
    send_login_email: send_login_email({ mailer, gen_token }),
    login,
    logout
});

export default accountRouter;