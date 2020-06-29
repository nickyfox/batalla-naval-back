import {connection} from "../database";
import {User} from "../models/User";

export async function findUserById(id: string | undefined) {
    if(id){
        const users = await connection.query("SELECT * FROM users WHERE id = ?", [id]);
        return users[0]
    } else {
        return null;
    }
}

export async function findUserByIdBeautiful(id: string | undefined) {
    if(id){
        const users: any[][] = await connection.query("SELECT * FROM users WHERE id = ?", [id]);
        return users[0][0]
    } else {
        return null;
    }
}

export async function saveUser(user: User) {
    await connection.query('INSERT INTO users SET ?', [user]);
}


export async function saveMatchHistory(winner_id: {winner_id: string | undefined}, loser_id: {loser_id: string | undefined}){
    const date = new Date().getTime();
    try {
        await connection.query("INSERT INTO match_history SET ?, ?, date=" + date, [winner_id, loser_id]);
    }catch (e) {
        console.log(e)
    }
}
