import { Router } from "express";
import { registerUser,loginUser,logoutUser,getUserName } from "../controllers/user.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router(); // this method is used to create a new router object

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/getUserName").get(getUserName);

export default router;
