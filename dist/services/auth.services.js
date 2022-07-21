"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_services_1 = require("./user.services");
const google_auth_library_1 = require("google-auth-library");
const credentials = require("../../credentials.json");
const client = new google_auth_library_1.OAuth2Client(credentials.web.client_id);
function verify(body) {
    return __awaiter(this, void 0, void 0, function* () {
        const ticket = yield client.verifyIdToken({
            idToken: body.token,
            audience: credentials.web.client_id,
        });
        const payload = ticket.getPayload();
        const userid = payload ? payload['sub'] : undefined;
        //TODO change this
        const user = yield user_services_1.findUserById(userid);
        console.log("USER: ", user);
        if (!user.length) {
            console.log("SAVING USER");
            const userToSave = {
                id: userid,
                username: payload === null || payload === void 0 ? void 0 : payload.name,
                name: payload === null || payload === void 0 ? void 0 : payload.given_name,
                lastName: payload === null || payload === void 0 ? void 0 : payload.family_name,
                email: payload === null || payload === void 0 ? void 0 : payload.email,
            };
            yield user_services_1.saveUser(userToSave);
        }
        else {
            console.log("USUARIO YA ESTA EN LA DB");
        }
        return payload;
    });
}
exports.verify = verify;
