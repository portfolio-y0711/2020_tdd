import {
    Request,
    Response,
    NextFunction
} from 'express';

import { getRepository } from 'typeorm';
import { List, Item } from '../../models/entities';
import { viewResolver } from '../../controllers/util';

export const get_list_by_id = async (req: Request, res: Response, next: NextFunction) => {
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
};

export const create_new_list = async (req: Request, res: Response, next: NextFunction) => {
    const { item_text } = req.body;
    const new_list = await getRepository(List).save({});
    const item = await getRepository(Item).save({ text: item_text, list: new_list });
    res.status(302).redirect(`/lists/${new_list.id}`);
};