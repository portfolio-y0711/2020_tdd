import { 
    Column,
    createConnection,
    Entity,
    getConnection,
    getRepository,
    PrimaryGeneratedColumn
} from "typeorm";

@Entity()
export class MyEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name?: string;
}

beforeEach(() => {
    return createConnection({
        type: "sqlite",
        database: ":memory:",
        dropSchema: true,
        entities: [MyEntity],
        synchronize: true,
        logging: false
    });
});

afterEach(() => {
    let conn = getConnection();
    return conn.close();
});

describe('mockDB', () => {
    test("store Joe and fetch it", async () => {
        await getRepository(MyEntity).insert({
            name: "Joe"
        });
        let joe = await getRepository(MyEntity).find({
            where: {
                id: 1
            }
        });
        expect(joe[0].name).toBe("Joe");
    });

    test("store Another and fetch it", async () => {
        await getRepository(MyEntity).insert({
            name: "Another"
        });
        let joe = await getRepository(MyEntity).find({
            where: {
                id: 1
            }
        });
        expect(joe[0].name).toBe("Another");
    });
});

