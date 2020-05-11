"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const index_routes_1 = __importDefault(require("./routes/index.routes"));
const users_routes_1 = __importDefault(require("./routes/users.routes"));
class App {
    constructor() {
        this.app = express_1.default();
        this.middlewares();
        this.routes();
    }
    routes() {
        this.app.use(index_routes_1.default);
        this.app.use('/users', users_routes_1.default);
    }
    middlewares() {
        this.app.use(morgan_1.default("dev"));
        this.app.use(express_1.default.json());
    }
    listen() {
        this.app.listen(8000, () => console.log('Server running on port 8000!'));
    }
}
exports.App = App;
