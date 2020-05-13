import {Router} from 'express'
import {verifyToken} from "../controllers/auth.controller";

const router = Router();

router.route('/')
    .post(verifyToken);

router.route('/:id')
export default router;
