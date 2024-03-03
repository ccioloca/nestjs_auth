import { DataSource } from "typeorm";
import { entities, migrations } from "./typeorm.config";

const username = process.env["DB_USERNAME"];
const password = process.env["DB_PASSWORD"];
const database = process.env["DB_NAME"];
const port = Number(process.env["DB_PORT"]);
const host = process.env["DB_HOST"];

export const AppDataSource = new DataSource({
    type: "postgres",
    host,
    port,
    username,
    password,
    database,
    synchronize: true,
    logging: true,
    entities: entities,
    migrations: migrations
});
