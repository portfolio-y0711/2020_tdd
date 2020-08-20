import {
    Request,
    Response,
    NextFunction,
} from 'express';

import { getRepository } from 'typeorm';
import { List, Item } from '../../../models/entities';

export const add_item = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { item_text } = req.body;
    const searched_list = await getRepository(List).findOne(id);
    const { id: listId } = searched_list!;
    await getRepository(Item).save({ text: item_text, list: searched_list });
    res.status(302).redirect(`/lists/${listId}`);
};