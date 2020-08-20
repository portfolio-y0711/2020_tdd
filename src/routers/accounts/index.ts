import {
    Router
} from 'express';
import { send_login_email } from './service';

export const AccountRouter = (service: any) => {
    const router = Router({ mergeParams: true });
    router.post('/accounts/send_login_email', service.send_login_email);
    return router;
};

const accountRouter = AccountRouter({ send_login_email })

export default accountRouter;