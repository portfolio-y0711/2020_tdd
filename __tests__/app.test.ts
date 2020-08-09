import 'should';
import { MustacheRenderer } from '../src/views';

describe('HomePageTest', () => {
    it('test_home_page_returns_correct_html', () => {
        const render = MustacheRenderer.getRenderer('./src/views/', 'mu');
        console.log(render('home', { title: 'To-Do lists from test', name: 'world' }));
    });
});