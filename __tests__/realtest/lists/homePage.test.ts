import 'should';
import { viewResolver } from '../../../src/controllers/util';
import { home_page } from '../../../src/views';

describe('HomePageTest', () => {
    it('test_root_url_resolves_to_home_page_view', () => {
        const found: Function = viewResolver('/');
        found.should.equal(home_page);
    });

    it('test_home_page_returns_correct_html', async () => {
        const response = await viewResolver('/')({ csrfToken: 'test' });
        (await home_page({ csrfToken: 'test' })).toString().should.equal(response);
    });
});