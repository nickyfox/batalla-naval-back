import {Request, Response} from "express";
import {OAuth2Client} from "google-auth-library";
import {verify} from "../services/auth.services";


export async function verifyToken(req: Request, res: Response) {
    const payload = await verify(req.body);
    return res.json({
        token: payload,
    });
}
