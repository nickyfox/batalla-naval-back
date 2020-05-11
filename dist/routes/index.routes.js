"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_controllers_1 = require("../controllers/index.controllers");
const router = express_1.Router();
router.route('/')
    .get(index_controllers_1.indexWelcome);
exports.default = router;
