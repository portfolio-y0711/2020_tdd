
import { Connection, getConnection } from "typeorm";
import { createDatabaseConnection } from "../../repositories/db";

beforeAll(async (done) => {
    try {
        await createDatabaseConnection();
        done();
    } catch(e) {
       done(e);
    }
})

afterAll(async (done) => {
    // await getConnection().close();
    //normal cleanup things
    done();
})

afterEach(async (done) => {
    try {
        done();
    } catch(e) {
        done(e);
    }
})

// https://github.com/nestjs/nest/issues/409

// const getEntities = (connection: Connection) => {
//     const entities: { name: any; tableName: any; }[] = [];
//     connection.entityMetadatas.forEach(
//       x => entities.push({name: x.name, tableName: x.tableName})
//     );
//     return entities;
// }