import fs from 'fs';
import mustache from 'mustache';


export const MustacheRenderer = (() => {
    const render = (filePath: string, options: any) => {
        const raw = fs.readFileSync(filePath).toString();
        return mustache.render(raw, options);
    };

    const getRenderer = (viewPath: string, extName: string) =>
        (viewName: string, options: any) => {
            const filePath = viewPath + viewName + '.' + extName;
            const raw = fs.readFileSync(viewPath + viewName + '.' + extName).toString();
            return render(filePath, options);
        }
    return {
        render,
        getRenderer
    }
})();