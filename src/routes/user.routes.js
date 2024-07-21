import { Router } from "express";
import { createUser, updateUser, getUsers, deleteUserById } from "../controllers/user.controller.js";
import { isAdmin, verifyToken } from "../middlewares/authJwt.js";
import { checkExistingUser } from "../middlewares/verifySignup.js";

const router = Router();

router.post("/", [verifyToken, isAdmin, checkExistingUser], createUser);
router.post("/:userId", [verifyToken, isAdmin], updateUser);
router.get("/", [verifyToken, isAdmin], getUsers);
router.delete("/:userId", [verifyToken, isAdmin], deleteUserById);

export default router;
