import 'should';
import { getRepository } from 'typeorm';
import { app } from '../../../src/app';
import { Item, List } from '../../../src/models/entities';
const request = require('supertest-session')(app);

describe('ListViewTest', () => {
    describe('if_you_create_a_list_and_you_know_the_id_of_that_list', () => {
        let list_of_id_to_find: number;
        beforeEach(async (done) => {
            const correctList = await getRepository(List).save({});
            const { id } = correctList;
            list_of_id_to_find = Number(id);
            const itemRepo = getRepository(Item);
            await itemRepo.save({ text: '리스트_아이템1', list: correctList });
            await itemRepo.save({ text: '리스트_아이템2', list: correctList });
            done();
        })
        it('[GET /lists/:list_of_id_to_find] will_displays_only_items_for_that_list', async (done) => {
            request
                .get(`/lists/${list_of_id_to_find}`)
                .expect(200)
                .then((res: any) => {
                    // console.log(res.text);
                    res.text.includes('리스트_아이템1').should.be.true();
                    res.text.includes('리스트_아이템2').should.be.true();
                    done();
                })
                .catch((e:any) => {
                    done(e);
                })
        });
    })
});