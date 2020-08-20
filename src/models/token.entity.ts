import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Token {
    @PrimaryColumn()
    uuid!: string;

    @Column()
    email!: string;
}