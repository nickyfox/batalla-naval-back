import {User} from "../models/User";
import {findUserById, saveUser} from "./user.services";
import {OAuth2Client} from "google-auth-library";

const credentials = require("../../credentials.json");
const client = new OAuth2Client(credentials.web.client_id);

export async function verify(body: any) {
    const ticket = await client.verifyIdToken({
        idToken: body.token,
        audience: credentials.web.client_id,
    });
    const payload = ticket.getPayload();
    const userid = payload ? payload['sub'] : undefined;

    //TODO change this
    const user: any | any[] | null = await findUserById(userid);

    console.log("USER: ", user);
    if(!user.length){
        console.log("SAVING USER");
        const userToSave: User = {
            id: Number(userid),
            username: payload?.name,
            name: payload?.given_name,
            lastName: payload?.family_name,
            email: payload?.email,
        };
        const userSaved = await saveUser(userToSave)
    } else {
        console.log("USUARIO YA ESTA EN LA DB")
    }
    return payload;
}
