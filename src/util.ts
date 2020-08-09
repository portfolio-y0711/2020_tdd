import path from 'path';

const routeTable: { [key: string]: string } = {
    '/': 'views.home_page'
};

export const resolve = (url: string) => {
    const viewPathString = routeTable[url];
    const viewPath = ('./' + viewPathString.split('.').join("/"));
    const { dir, name } = path.parse(viewPath);
    const methods = require(dir);
    return methods[name];
};

