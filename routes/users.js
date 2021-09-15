import Router from 'express';
import {
    register,
    login,
    logout,
    me,
    checkSession,
} from "../controllers/users.js"
import isLoggedIn from '../middlewares/isLoggedIn.js';

const userRoutes = Router();

userRoutes.post("/register", register);
userRoutes.post("/login", login)
userRoutes.get("/logout", logout)
userRoutes.get("/me", me)
//userRoutes.get("/verify", verify)


//by luis H ------

userRoutes.get("/checkSession",isLoggedIn, checkSession)

//-----------------

export default userRoutes;