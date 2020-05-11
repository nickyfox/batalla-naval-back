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
function getUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield database_1.connect();
        const users = yield conn.query("SELECT * FROM users");
        return res.json(users[0]);
    });
}
exports.getUsers = getUsers;
function getUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const conn = yield database_1.connect();
        const user = yield conn.query("SELECT * FROM users WHERE id = ?", [id]);
        return res.json(user[0]);
    });
}
exports.getUser = getUser;
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const newUser = req.body;
        const conn = yield database_1.connect();
        yield conn.query('INSERT INTO users SET ?', [newUser]);
        return res.json({
            user: newUser
        });
    });
}
exports.createUser = createUser;
function deleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const conn = yield database_1.connect();
        yield conn.query("DELETE FROM users WHERE id = ?", [id]);
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
        const conn = yield database_1.connect();
        yield conn.query("UPDATE users SET ? WHERE id = ?", [updatedUser, id]);
        return res.json({
            message: "User updated"
        });
    });
}
exports.updateUser = updateUser;
