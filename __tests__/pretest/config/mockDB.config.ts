import { Column, ConnectionOptions, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MyEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name?: string;
}

export const config: ConnectionOptions = {
    type: 'sqlite',
    database: ":memory:",
    dropSchema: true,
    entities: [ MyEntity ],
    synchronize: true,
    logging: false,
};

