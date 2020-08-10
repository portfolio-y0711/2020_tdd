
import { Item } from "../models/item.entity";
import { Connection, getConnection } from "typeorm";
import { createDatabaseConnection } from "../db";

beforeAll(async (done) => {
    try {
        await createDatabaseConnection();
        done();
    } catch(e) {
       done(e);
    }
})

afterAll(async (done) => {
    await getConnection().close();
    //normal cleanup things
    done();
})

afterEach(async (done) => {
    try {
        await getConnection().getRepository(Item).delete({});
    } catch(e) {
        console.log(e);
    }
    done();
})

// https://github.com/nestjs/nest/issues/409

// const getEntities = (connection: Connection) => {
//     const entities: { name: any; tableName: any; }[] = [];
//     connection.entityMetadatas.forEach(
//       x => entities.push({name: x.name, tableName: x.tableName})
//     );
//     return entities;
// }