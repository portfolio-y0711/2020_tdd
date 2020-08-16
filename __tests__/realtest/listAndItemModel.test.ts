import { List } from "../../src/models/entities";
import { Entity, getRepository, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { MinLength, Length } from 'class-validator';

@Entity()
export class Item {
    @PrimaryColumn()
    text?: string;

    @ManyToOne((type) => List, list => list.items)
    list?: List;
}

describe('ListAndItemModelsTest', () => {
    // it('test_saving_and_retrieving_items', () => {

    // });

    it('test_cannot_save_empty_list_items', async (done) => {
        const list_ = await getRepository(List).save({});
        const item = await getRepository(Item).save({ list: list_, text: '' });
        done();
    });
});