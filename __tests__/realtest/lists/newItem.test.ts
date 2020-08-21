import 'should';
import { Item, List } from '../../../src/models/entities';
import { getRepository } from 'typeorm';
import { app } from '../../../src/app';
const request = require('supertest-session')(app);

describe('NewItemTest', () => {
    let token: string;
    beforeAll((done) => {
        request
            .get('/')
            .end((err: any, res: any) => {
                const re = new RegExp(/"_csrf"\s+value="(.+)">/);
                token = re.exec(res.text)![1];
                done();
            })
    });

    it('test_can_save_a_POST_request_to_an_existing_list', async (done) => {
        const other_list = await getRepository(List).save({});
        const correct_list = await getRepository(List).save({});
        request
            .post(`/lists/${correct_list.id}/add_item`)
            .type('form')
            .send({ _csrf: token, item_text: '기존 목록에 추가된 아이템' })
            .then(async (res: Response) => {
                res.status.should.equal(302);
                (await getRepository(List)
                    .find()).length.should.equal(2);
                const new_item: Item[] = (await getRepository(Item)
                    .find());
                new_item.length.should.equal(1);
                (new_item[0]).text!.should.equal('기존 목록에 추가된 아이템');
                const saved_list: List = (await getRepository(Item)
                    .createQueryBuilder('item')
                    .innerJoinAndSelect('item.list', 'list')
                    .where('item.list=:id', { id: correct_list.id })
                    .getOne())?.list!;
                saved_list.id!.should.equal(correct_list.id);
                done();
            })
            .catch((e: any) => {
                done(e);
            })
    });

    describe('[POST /lists/new] if you send a form WITH csrfToken', () => {
        it('will process your request', (done) => {
            request
                .post('/lists/new')
                .type('form')
                .send({ _csrf: token, item_text: '신규 아이템' })
                .then((res: Response) => {
                    res.status.should.equal(302);
                    done();
                }).catch((e: any) => {
                    done(e);
                });
        })
    });
});
