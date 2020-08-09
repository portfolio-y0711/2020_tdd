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

const home_page = () => {
    // return '<html><title>To-Do lists</title>ok</html>';
    return MustacheRenderer.render('./src/views/home.mu');
}

export { MustacheRenderer, home_page }
