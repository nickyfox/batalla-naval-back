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

export async function findUserByIdBeautiful(id: string | undefined) {
    if(id){
        const conn = await connect();
        const users: any[][] = await conn.query("SELECT * FROM users WHERE id = ?", [id]);
        return users[0][0]
    } else {
        return null;
    }
}

export async function saveUser(user: User) {
    const conn = await connect();
    await conn.query('INSERT INTO users SET ?', [user]);
}


export async function saveMatchHistory(winner_id: {winner_id: string | undefined}, loser_id: {loser_id: string | undefined}){
    const conn = await connect();
    try {
        await conn.query("INSERT INTO match_history SET ?, ?", [winner_id, loser_id]);
    }catch (e) {
        console.log(e)
    }
}
