import {
    Column,
    Entity,
    PrimaryColumn,
    UpdateDateColumn
} from "typeorm";

@Entity()
export class Oauth {
    @PrimaryColumn()
    service_name!: string;

    @Column()
    access_token!: string

    @Column()
    refresh_token!: string

    @UpdateDateColumn({ name: 'updatedAt'})
    updatedAt?: Date;
}