import { addUser, getUsers, getUser, updateUser, deleteUser, loginWithOtp, verifyLoginOtp} from "../controller/user.controller";
import express from "express";

const router = express.Router();

router.post("/add-user", addUser);
router.get("/get-users", getUsers);
router.get("/get-user/:userid", getUser);
router.put("/update-user/:userid", updateUser);
router.delete("/delete-user/:userid", deleteUser);
router.post("/login-with-otp", loginWithOtp);
router.post("/verify-login-otp", verifyLoginOtp);

export default router;