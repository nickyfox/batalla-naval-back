import {connect} from "../database";
import {User} from "../models/User";

export async function findUserById(id: string | undefined) {
    if(id){
        const conn = await connect();
        const users = await conn.query("SELECT * FROM users WHERE id = ?", [id]);
        return users[0]
    } else {
        return null;
    }
}

export async function saveUser(user: User) {
    const conn = await connect();
    const query = await conn.query('INSERT INTO users SET ?', [user]);
}
