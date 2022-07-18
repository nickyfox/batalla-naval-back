import {createPool, Pool} from "mysql2/promise";


function connect() {
    return createPool({
        host: '127.0.0.1',
        user: 'root',
        password: 'password',
        port: 3306,
        database: 'batalla_naval',
        connectionLimit: 10
    });
}

export const connection: Pool = connect();
