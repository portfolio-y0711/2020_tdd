import 'should';
import { viewResolver } from '../src/controllers/util';
import { getRepository } from 'typeorm';
import { Item } from '../src/models/item.entity';
import { app } from '../src/app';
import request, { Response } from 'supertest';
import { home_page } from '../src/views';

describe('NewListTest', () => {
    let token: string;
    beforeAll((done) => {
        request(app)
            .get('/')
            .end((err, res: Response) => {
                const re = new RegExp(/"_csrf"\s+value="(.+)">/);
                token = re.exec(res.text)![1];
                done();
            })
    });
    it('will process your request', (done) => {
        request(app)
            .post('/lists/new')
            .type('form')
            .send({ _csrf: token, item_text: '신규 아이템' })
            .expect(302)
            .then((res: Response) => {
                const repo = getRepository(Item);
                repo.find().then((items) => {
                    items[items.length - 1].text!.should.equal('신규 아이템');
                });
                done();
            })
            .catch(e => {
                done(e);
            });
    })

});

describe('HomePageTest', () => {
    it('test_root_url_resolves_to_home_page_view', () => {
        const found: Function = viewResolver('/');
        found.should.equal(home_page);
    });

    it('test_home_page_returns_correct_html', async () => {
        const response = await viewResolver('/')({ csrfToken: 'test' });
        (await home_page({ csrfToken: 'test' })).toString().should.equal(response);
    });

    it('test_home_page_can_save_a_POST_request', async () => {
        await home_page({ item_text: '신규 아이템' });
        const repo = getRepository(Item);
        (await repo.find()).length.should.equal(1);
        const new_item = (await repo.find())[0];
        new_item.text!.should.equal('신규 아이템');
    });

    describe('test_home_page_redirects_after_POST', () => {
        let token: string;
        beforeAll((done) => {
            request(app)
                .get('/')
                .end((err, res: Response) => {
                    const re = new RegExp(/"_csrf"\s+value="(.+)">/);
                    token = re.exec(res.text)![1];
                    done();
                })
        });
        it('will process your request', (done) => {
            request(app)
                .post('/lists/new')
                .type('form')
                .send({ _csrf: token, item_text: '신규 아이템' })
                .expect(302)
                .then((res: Response) => {
                    expect(res.get('location')).toBe('/lists/the-only-list-in-the-world');
                    done();
                })
                .catch(e => {
                    done(e);
                });
        })
    });
});

describe('ListViewTest', () => {
    it('test_displays_all_list_items', async (done) => {
        const repo = getRepository(Item);
        await repo.save({ text: '아이템1' });
        await repo.save({ text: '아이템2' });

        const found = viewResolver('/lists/the-only-list-in-the-world');
        const response = await found();

        response.includes('아이템1').should.be.true();
        response.includes('아이템2').should.be.true();
        done();
    });
})

describe('MiddlewareTest', () => {
    describe('GET / <= will send you a form with csrfToken', () => {
        let token: string;

        beforeAll((done) => {
            request(app)
                .get('/')
                .end((err, res: Response) => {
                    const re = new RegExp(/"_csrf"\s+value="(.+)">/);
                    token = re.exec(res.text)![1];
                    done();
                })
        });

        describe('POST / <= if you send a form WITHOUT csrfToken', () => {
            it('will NOT process your request', (done) => {
                request(app)
                    .post('/lists/new')
                    .type('form')
                    .send({ item_text: '신규 아이템' })
                    .then((res: Response) => {
                        res.status.should.equal(401);
                        res.text.should.equal('unauthorized');
                        done();
                    }).catch(e => {
                        done(e);
                    });
            })
        })
    })


    // let token: any;
    // beforeAll((done) => {
    //   request(app)
    //     .post('/login')
    //     .send({
    //       username: 'yoonsung',
    //       password: '1234'
    //     }).end((err, response: Response) => {
    //       token = response.body;
    //       done();
    //     });
    // });

    // describe('GET/ ', () => {
    //   test('It shoud require authorization', (done) => {
    //     return request(app)
    //       .get('/')
    //       .then((res: Response) => {
    //         expect(res.status).toBe(401);
    //         done();
    //       }).catch(e => {
    //         done(e);
    //       });
    //   });
    //   test('request with token', (done) => {
    //     return request(app)
    //       .get('/')
    //       .set('Authorization', `Bearer ${token}`)
    //       .then((res: Response) => {
    //         expect(res.status).toBe(200);
    //         expect(res.type).toBe('application/json');
    //         done();
    //       }).catch(e => {
    //         done(e);
    //       });
    //   });
    // })

});

describe('ItemModelTest', () => {
    it('test_saving_and_retrieving_items', async (done) => {
        const repo = getRepository(Item);
        const item1 = repo.create({ text: '첫번째 아이템' });
        await repo.save(item1);
        const item2 = repo.create({ text: '두번째 아이템' });
        await repo.save(item2);
        (await repo.find({})).length.should.equal(2);
        done();
    });
});