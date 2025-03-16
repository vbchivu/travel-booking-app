import express from "express";
import { login, refreshToken, signup } from "../controllers/authController";
import { authenticateJWT } from "@travel-app/shared";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.get("/protected-route", authenticateJWT, (_req, res) => {
    res.json({ message: "Access granted" });
});

export default router;
