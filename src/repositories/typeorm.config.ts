const dotenv = require('dotenv');
import path from 'path';
import { ConnectionOptions } from 'typeorm';


dotenv.config({
    path: './.env'
});

const MYSQL_HOST = process.env.MYSQL_HOST;
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
const MYSQL_PORT = Number(process.env.MYSQL_PORT);
const MYSQL_DATABASE = process.env.MYSQL_DATABASE;
const PORT = Number(process.env.PORT);


export const config: ConnectionOptions = {
    type: 'mysql',
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    username: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    dropSchema: true,
    entities: [
        'src/models/*.entity{.ts,.js}',
    ],
    synchronize: true
};

