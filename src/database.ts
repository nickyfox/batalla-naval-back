import {createPool, Pool} from "mysql2/promise";


function connect() {
    return createPool({
        host: 'localhost',
        user: 'root',
        password: 'new-password',
        port: 3306,
        database: 'batalla_naval',
        connectionLimit: 10
    });
}

export const connection: Pool = connect();
