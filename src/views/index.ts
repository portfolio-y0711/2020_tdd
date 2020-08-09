import fs from 'fs';
import mustache, { render } from 'mustache';


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

const home_page = (options?: any) => {
    if (options.item_text) return MustacheRenderer.render('./src/views/home.mu', options);
    else return MustacheRenderer.render('./src/views/home.mu', options);
}

export { MustacheRenderer, home_page }
