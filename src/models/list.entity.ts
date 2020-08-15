import {
    Entity,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";

import { Item } from "./item.entity";

@Entity()
export class List {
    @PrimaryGeneratedColumn()
    id?: number

    @OneToMany(type => Item, item => item.list)
    items?: Item[]
};