import { Router } from 'express';
import { admin, login } from './service';

export const AdminRouter = (service: any) => {
    const router = Router({ mergeParams: true });
    router.get('/admin', service.admin );
    router.post('/admin/login', service.login );
    return router;
};

const adminRouter = AdminRouter({ admin, login });

export default adminRouter;

