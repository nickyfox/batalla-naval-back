import express, {Application} from 'express';
import cors from "cors"
import morgan from "morgan";
import UsersRoutes from "./routes/users.routes"
import AuthRoutes from "./routes/auth.routes"
export class App {

    private app: Application;

    constructor() {
        this.app = express();
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
    listen(){
        this.app.listen(8000, () => console.log('Server running on port 8000!'));
    }
}
