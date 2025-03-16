// services/shared/src/auth/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { config } from "../config/env";
import { verifyToken } from "./tokenService";

declare module "express" {
    interface Request {
        user?: { id: string; role: string };
    }
}

/**
 * Middleware to authenticate JWT tokens.
 * Ensures valid access token before proceeding.
 */
export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
    }

    const decoded = verifyToken(token, config.jwtSecret);
    if (!decoded) {
        res.status(403).json({ message: "Invalid or expired token" });
        return;
    }

    req.user = decoded as { id: string; role: string }; // Attach user info to request
    next();
};
