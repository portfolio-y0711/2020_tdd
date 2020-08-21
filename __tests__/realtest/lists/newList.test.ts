import 'should';
import { Item, List } from '../../../src/models/entities';
import { getRepository } from 'typeorm';
import { app } from '../../../src/app';
import express from 'express';
const request = require('supertest-session')(app);

describe('NewListTest', () => {
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

    it('test_home_page_can_save_a_POST_request', async (done) => {
        request
            .post('/lists/new')
            .type('form')
            .send({ _csrf: token, item_text: '신규 아이템1' })
            .then(async (res: Response) => {
                const saved = await getRepository(Item).find();
                saved[saved.length - 1].text!.should.equal('신규 아이템1');
                done();
            })
            .catch((e:any) => {
                done(e);
            });

    });

    it('test_redirects_after_POST', async (done) => {
        request
            .post('/lists/new')
            .type('form')
            .send({ _csrf: token, item_text: '신규 아이템2' })
            .expect(302)
            .then(async (res: express.Request) => {
                const list = await getRepository(List).find();
                const { id } = list[list.length - 1];
                expect(res.get('location')).toBe(`/lists/${id}`);
                done();
            })
            .catch((e:any) => {
                done(e);
            });
    });
});