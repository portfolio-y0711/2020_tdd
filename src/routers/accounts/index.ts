import {
    Router
} from 'express';
import { send_login_email, login } from './service';

export const AccountRouter = (service: any) => {
    const router = Router({ mergeParams: true });
    router.post('/accounts/send_login_email', service.send_login_email);
    router.get('/accounts/login', service.login);
    return router;
};

const accountRouter = AccountRouter({ send_login_email, login })

export default accountRouter;