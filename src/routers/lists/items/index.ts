import { Router } from 'express';
import { add_item } from './service';

const ItemRouter = (service: any) => {
    const router = Router({ mergeParams: true });
    router.post('/add_item', add_item);
    return router;
}

const itemRouter = ItemRouter({ add_item })

export default itemRouter;