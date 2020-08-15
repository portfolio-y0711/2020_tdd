import { createConnection } from "typeorm";
import { config } from "./typeorm.config";

export async function createDatabaseConnection() {
  return await createConnection(config)
}
