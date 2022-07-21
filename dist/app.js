"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
class App {
    constructor(port) {
        this.app = express_1.default();
        this.app.set('port', port);
        this.middlewares();
        this.routes();
    }
    routes() {
        this.app.use('/users', users_routes_1.default);
        this.app.use('/auth', auth_routes_1.default);
    }
    middlewares() {
        this.app.use(morgan_1.default("dev"));
        this.app.use(express_1.default.json({ limit: '50mb' }));
        this.app.use(cors_1.default());
        // this.app.use(express.bodyParser({limit: '50mb'}));
    }
}
exports.App = App;
