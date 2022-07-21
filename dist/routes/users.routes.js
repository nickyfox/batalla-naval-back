"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../controllers/users.controller");
const router = express_1.Router();
router.route('/')
    .get(users_controller_1.getUsers)
    .post(users_controller_1.createUser);
router.route('/single/:id')
    .get(users_controller_1.getUser)
    .put(users_controller_1.updateUser)
    .delete(users_controller_1.deleteUser);
// -------------- Users waiting to play ---------------------------
router.route("/waiting")
    .get(users_controller_1.getUsersWaiting)
    .post(users_controller_1.addUserWaiting);
router.route("/waiting/delete/:id")
    .delete(users_controller_1.deleteUserWaiting);
// ---------------- Match history ---------------------------------
router.route("/history/:winnerId/:loserId")
    .get(users_controller_1.getMatchHistory)
    .post(users_controller_1.addMatchHistory);
router.route("/history/:userId")
    .get(users_controller_1.getPlayerMatchHistory);
exports.default = router;
