import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn
} from "typeorm";

@Entity()
export class Token {
    @PrimaryColumn()
    uuid!: string;

    @Column()
    email!: string;

    @CreateDateColumn({ name: 'createdAt' })
    createdAt!: Date;
}