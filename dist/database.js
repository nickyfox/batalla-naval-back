"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = require("mysql2/promise");
function connect() {
    return promise_1.createPool({
        host: '127.0.0.1',
        user: 'root',
        password: 'password',
        port: 3306,
        database: 'batalla_naval',
        connectionLimit: 10
    });
}
exports.connection = connect();
