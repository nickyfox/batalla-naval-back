import {Request, Response} from "express";
import {connect} from "../database";
import { User } from "../models/User";
import {findUserById, saveMatchHistory, saveUser} from "../services/user.services";

export async function getUsers(req: Request, res: Response): Promise<Response> {
    const conn = await connect();
    const users = await conn.query("SELECT * FROM users");
    return res.json(users[0]);
}

export async function getUser(req: Request, res: Response) {
    const id = req.params.id;
    const user = await findUserById(id);
    return res.json(user)
}

export async function createUser(req: Request, res: Response) {
    await saveUser(req.body);
    return res.json({
        user: req.body
    })
}

export async function deleteUser(req: Request, res: Response) {
    const id = req.params.id;
    const conn = await connect();
    await conn.query("DELETE FROM users WHERE id = ?", [id]);
    return res.json({
        message: "User deleted"
    })
}

export async function updateUser(req: Request, res: Response) {
    const id = req.params.id;
    const updatedUser: User = req.body;
    const conn = await connect();
    await conn.query("UPDATE users SET ? WHERE id = ?", [updatedUser, id]);
    return res.json({
        message: "User updated"
    })
}

export async function getUsersWaiting(req: Request, res: Response): Promise<Response> {
    const conn = await connect();
    const users = await conn.query("SELECT * FROM users_waiting");
    return res.json(users[0]);
}

export async function deleteUserWaiting(req: Request, res: Response) {
    const conn = await connect();
    const user_id = req.params.id;
    await conn.query("DELETE FROM users_waiting WHERE user_id = ?", [user_id]);
    return res.json({
        message: "User deleted"
    })
}

export async function addUserWaiting(req: Request, res: Response) {
    const user_id = {user_id: req.body.id};
    const conn = await connect();
    try {
        await conn.query("INSERT INTO users_waiting SET ?", [user_id]);
    }catch (e) {
        console.log(e)
    }
    return res.json({
        message: "User added"
    })
}

export async function getMatchHistory(req: Request, res: Response) {
    const winner_id = req.params.winnerId;
    const loser_id = req.params.loserId;
    const conn = await connect();
    const history = await conn.query("SELECT * FROM match_history WHERE winner_id = ? AND loser_id = ?", [winner_id, loser_id]);
    return res.json(history[0]);
}

export async function addMatchHistory(req: Request, res: Response) {
    const winnerId = {winner_id: req.params.winnerId};
    const loserId = {loser_id: req.params.loserId};
    await saveMatchHistory(winnerId, loserId);
    return res.json({
        message: "Match history added"
    })
}

export async function getPlayerMatchHistory(req: Request, res: Response){
    const player_id = req.params.userId;
    const conn = await connect();
    const [winnerRows]: any[] = await conn.query("SELECT * FROM match_history WHERE winner_id = ?", [player_id]);
    const [loserRows]: any[] = await conn.query("SELECT * FROM match_history WHERE loser_id = ?", [player_id]);

    let beautifulWinnerRows: any[] = await Promise.all(winnerRows.map(async (row: any) => {
        return {
            user: await findUserById(row.loser_id),
            won: true
        }
    }));

    let beautifulLoserRows: any[] = await Promise.all(loserRows.map(async (row: any) => {
        return {
            user: await findUserById(row.winner_id),
            won: false
        }
    }));

    return res.json([...beautifulWinnerRows, ...beautifulLoserRows])
}
