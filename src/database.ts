import {createPool} from "mysql2/promise";


export async function connect() {
    const connection = await createPool({
        host: 'localhost',
        user: 'root',
        password: 'password',
        port: 3306,
        database: 'batalla_naval',
        connectionLimit: 10
    });
    return connection;
}