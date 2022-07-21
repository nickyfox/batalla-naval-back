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
const database_1 = require("../database");
function findUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (id) {
            const users = yield database_1.connection.query("SELECT * FROM users WHERE id = ?", [id]);
            return users[0];
        }
        else {
            return null;
        }
    });
}
exports.findUserById = findUserById;
function findUserByIdBeautiful(id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (id) {
            const users = yield database_1.connection.query("SELECT * FROM users WHERE id = ?", [id]);
            return users[0][0];
        }
        else {
            return null;
        }
    });
}
exports.findUserByIdBeautiful = findUserByIdBeautiful;
function saveUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.connection.query('INSERT INTO users SET ?', [user]);
    });
}
exports.saveUser = saveUser;
function saveMatchHistory(winner_id, loser_id, gameInitialTime) {
    return __awaiter(this, void 0, void 0, function* () {
        const date = new Date().getTime();
        const time = date - gameInitialTime;
        try {
            yield database_1.connection.query("INSERT INTO match_history SET ?, ?, date=" + date + ", time=" + time, [winner_id, loser_id]);
        }
        catch (e) {
            console.log(e);
        }
    });
}
exports.saveMatchHistory = saveMatchHistory;
