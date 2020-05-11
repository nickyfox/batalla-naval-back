import {Router} from 'express'
import {getUsers, getUser, createUser, deleteUser, updateUser} from "../controllers/users.controller";

const router = Router();

router.route('/')
    .get(getUsers)
    .post(createUser);

router.route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);
export default router;