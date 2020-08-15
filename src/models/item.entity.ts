import {
    Entity,
    ManyToOne,
    PrimaryColumn
} from "typeorm";

import { List } from "./list.entity";

@Entity()
export class Item {
    @PrimaryColumn()
    text?: string;

    @ManyToOne((type) => List, list => list.items)
    list?: List;
}