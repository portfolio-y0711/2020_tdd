require("ts-node/register")
require("tsconfig-paths/register")
// import "dotenv/config"
import { createConnection } from "typeorm"
import { ConnectionOptions } from "typeorm"
import { config } from "../../repositories/typeorm.config";

/*
 * This file is executed by Jest before running any tests.
 * We drop the database and re-create it from migrations every time.
 */
export default (async () => {
  // Force dropping the schema so that test run clean every time.
  // Note that we are not cleaning *between* tests.
  const testOrmConfig: ConnectionOptions = {
    ...(config as ConnectionOptions),
    dropSchema: true,
  }

  const t0 = Date.now()
  const connection = await createConnection(testOrmConfig)
  const connectTime = Date.now()
  await connection.runMigrations()
  const migrationTime = Date.now()
  console.log(
    ` 👩‍🔬 Connected in ${connectTime -
      t0}ms - Executed migrations in ${migrationTime - connectTime}ms.`
  )
});