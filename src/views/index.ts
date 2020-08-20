import fs from 'fs';
import mustache, { render } from 'mustache';
import { Item } from '../models/item.entity';
import { getRepository } from 'typeorm';

const MustacheRenderer = (() => {
    const getRenderer = (viewPath: string, extName: string) =>
        (viewName: string, options: any) => {
            const filePath = viewPath + viewName + '.' + extName;
            const raw = fs.readFileSync(viewPath + viewName + '.' + extName).toString();
            return render(filePath, options);
        }
    const render = (filePath: string, options?: any) => {
        const raw = fs.readFileSync(filePath).toString();
        return mustache.render(raw, options);
    };
    return {
        render,
        getRenderer
    }
})();

const home_page: (options?: any) => Promise<string> = async (options?: any) => {
    return MustacheRenderer.render('./src/views/home.mu', options);
}

const view_list: (options?: any) => Promise<string> = async (options?: any) => {
    const repo = getRepository(Item);
    let idx = 1;
    options = Object.assign({}, options, { index: () => idx++ });
    return MustacheRenderer.render('./src/views/list.mu', options);
};

export { home_page, view_list }
export { MustacheRenderer }
