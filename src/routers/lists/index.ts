import { Router } from 'express';
import {
    create_new_list,
    get_list_by_id
} from './service';

const ListRouter = (service: any) => {
    const router = Router();
    router.use('/lists/:id', require('./items').default);
    router.post('/lists/new', service.create_new_list);
    router.get('/lists/:id', service.get_list_by_id);
    return router;
};

const listRouter = ListRouter({ create_new_list, get_list_by_id });

export default listRouter;