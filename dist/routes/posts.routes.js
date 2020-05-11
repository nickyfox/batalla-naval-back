"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const posts_controller_1 = require("../controllers/posts.controller");
const router = express_1.Router();
router.route('/')
    .get(posts_controller_1.getPosts);
exports.default = router;
