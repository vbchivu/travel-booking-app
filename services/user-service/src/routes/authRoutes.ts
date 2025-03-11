import express from "express";
import { login, refreshToken, signup } from "../controllers/authController";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", refreshToken);

export default router;
