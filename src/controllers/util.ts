import path from 'path';
import { getRepository } from 'typeorm';
import { Item } from '../models/item.entity';
import { MustacheRenderer } from '../views';

const routeTable: { [key: string]: string } = {
    '/': 'views.home_page',
    '/lists': 'views.view_list'
};

export const viewResolver = (url: string): { (options?: any) : Promise<string> } => {
    const viewPathString = routeTable[url];
    const viewPath = ('./' + viewPathString.split('.').join("/"));
    const { dir, name } = path.parse(viewPath);
    const methods = require(path.join(__dirname, `../${dir}`));
    // const result: (options?: any) => Promise<string> = methods[name];
    // return result;
    return methods[name];
} ;
