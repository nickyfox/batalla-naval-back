import {Request, Response} from "express";
import {connect} from "../database";
import { User } from "../models/User";
import {findUserById, saveUser} from "../services/user.services";

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
