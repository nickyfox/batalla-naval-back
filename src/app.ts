import express, {Application} from 'express';
import cors from "cors"
import morgan from "morgan";
import UsersRoutes from "./routes/users.routes"
import AuthRoutes from "./routes/auth.routes"
export class App {

    public app: Application;
    constructor(port: string) {
        this.app = express();
        this.app.set('port', port);
        this.middlewares();
        this.routes();
    }

    routes(){
        this.app.use('/users', UsersRoutes);
        this.app.use('/auth', AuthRoutes);
    }

    middlewares() {
        this.app.use(morgan("dev"));
        this.app.use(express.json());
        this.app.use(cors())
    }
}
