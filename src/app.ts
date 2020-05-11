import express, {Application, Request, Response, NextFunction} from 'express';
import morgan from "morgan";
import UsersRoutes from "./routes/users.routes"
export class App {

    private app: Application;

    constructor() {
        this.app = express();
        this.middlewares();
        this.routes();
    }

    routes(){
        this.app.use('/users', UsersRoutes);
    }

    middlewares() {
        this.app.use(morgan("dev"));
        this.app.use(express.json());
    }
    listen(){
        this.app.listen(8000, () => console.log('Server running on port 8000!'));
    }
}