import {Router} from 'express'
import {
    getUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser,
    getUsersWaiting,
    addUserWaiting, deleteUserWaiting
} from "../controllers/users.controller";

const router = Router();

router.route('/')
    .get(getUsers)
    .post(createUser);

router.route('/single/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

// -------------- Users waiting to play ---------------------------

router.route("/waiting")
    .get(getUsersWaiting)
    .post(addUserWaiting);

router.route("/waiting/delete/:id")
    .delete(deleteUserWaiting);
export default router;
