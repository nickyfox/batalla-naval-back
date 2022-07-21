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
const user_services_1 = require("../services/user.services");
function getUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield database_1.connection.query("SELECT * FROM users");
        return res.json(users[0]);
    });
}
exports.getUsers = getUsers;
function getUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const user = yield user_services_1.findUserById(id);
        return res.json(user);
    });
}
exports.getUser = getUser;
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield user_services_1.saveUser(req.body);
        return res.json({
            user: req.body
        });
    });
}
exports.createUser = createUser;
function deleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        yield database_1.connection.query("DELETE FROM users WHERE id = ?", [id]);
        return res.json({
            message: "User deleted"
        });
    });
}
exports.deleteUser = deleteUser;
function updateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const updatedUser = req.body;
        yield database_1.connection.query("UPDATE users SET ? WHERE id = ?", [updatedUser, id]);
        return res.json({
            message: "User updated"
        });
    });
}
exports.updateUser = updateUser;
function getUsersWaiting(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield database_1.connection.query("SELECT * FROM users_waiting");
        return res.json(users[0]);
    });
}
exports.getUsersWaiting = getUsersWaiting;
function deleteUserWaiting(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user_id = req.params.id;
        yield database_1.connection.query("DELETE FROM users_waiting WHERE user_id = ?", [user_id]);
        return res.json({
            message: "User deleted"
        });
    });
}
exports.deleteUserWaiting = deleteUserWaiting;
function addUserWaiting(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user_id = { user_id: req.body.id };
        try {
            yield database_1.connection.query("INSERT INTO users_waiting SET ?", [user_id]);
        }
        catch (e) {
            console.log(e);
        }
        return res.json({
            message: "User added"
        });
    });
}
exports.addUserWaiting = addUserWaiting;
function getMatchHistory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const winner_id = req.params.winnerId;
        const loser_id = req.params.loserId;
        const history = yield database_1.connection.query("SELECT * FROM match_history WHERE winner_id = ? AND loser_id = ?", [winner_id, loser_id]);
        return res.json(history[0]);
    });
}
exports.getMatchHistory = getMatchHistory;
function addMatchHistory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const winnerId = { winner_id: req.params.winnerId };
        const loserId = { loser_id: req.params.loserId };
        yield user_services_1.saveMatchHistory(winnerId, loserId, new Date().getTime());
        return res.json({
            message: "Match history added"
        });
    });
}
exports.addMatchHistory = addMatchHistory;
function getPlayerMatchHistory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const player_id = req.params.userId;
        const [winnerRows] = yield database_1.connection.query("SELECT * FROM match_history WHERE winner_id = ?", [player_id]);
        const [loserRows] = yield database_1.connection.query("SELECT * FROM match_history WHERE loser_id = ?", [player_id]);
        let beautifulWinnerRows = yield Promise.all(winnerRows.map((row) => __awaiter(this, void 0, void 0, function* () {
            return {
                user: yield user_services_1.findUserByIdBeautiful(row.loser_id),
                date: row.date,
                won: true,
                time: row.time
            };
        })));
        let beautifulLoserRows = yield Promise.all(loserRows.map((row) => __awaiter(this, void 0, void 0, function* () {
            return {
                user: yield user_services_1.findUserByIdBeautiful(row.winner_id),
                date: row.date,
                won: false,
                time: row.time
            };
        })));
        const aux = winnerRows.length + loserRows.length;
        const division = aux !== 0 ? aux : 1;
        // {wins: any[], losses: any[]}
        let result = {
            winrate: (winnerRows.length / division) * 100,
            history: [...beautifulWinnerRows, ...beautifulLoserRows].sort((row1, row2) => {
                return row1.date - row2.date;
            })
        };
        // result = {...result, history: result.history.slice(Math.max(result.history.length - 5, 0))};
        console.log("RESULT: ", result);
        return res.json(result);
    });
}
exports.getPlayerMatchHistory = getPlayerMatchHistory;
