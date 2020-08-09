import 'should';
import { MustacheRenderer } from '../src/views';
import { home_page } from '../src/views'
import { resolve } from '../src/util';

describe('HomePageTest', () => {
    it ('test_root_url_resolves_to_home_page_view', () => {
        const found: Function = resolve('/');
        found.should.equal(home_page);
    });

    it('test_home_page_returns_correct_html', () => {
        home_page().should.startWith('<html>');
        home_page().includes('<title>To-Do lists</title>').should.be.true();
        home_page().should.endWith('</html>');
    });
});