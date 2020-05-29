import {Request, Response} from "express";
import {verify} from "../services/auth.services";


export async function verifyToken(req: Request, res: Response) {
    const payload = await verify(req.body);
    return res.json({
        payload: payload,
    });
}
