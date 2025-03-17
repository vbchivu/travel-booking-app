// services/shared/src/auth/tokenService.ts
import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../config/env";

interface UserPayload {
    id: string;
    role: string;
}

/**
 * Generates an access token and refresh token for a user.
 */
export const generateTokens = (user: UserPayload) => {
    const jwtOptions: SignOptions = { expiresIn: parseInt(config.jwtExpiration, 10) };
    const refreshOptions: SignOptions = { expiresIn: parseInt(config.refreshExpiration, 10) };

    const accessToken = jwt.sign(user, config.jwtSecret, jwtOptions);
    const refreshToken = jwt.sign(user, config.refreshTokenSecret, refreshOptions);

    return { accessToken, refreshToken };
};

/**
 * Verifies a token and returns its payload if valid.
 */
export const verifyToken = (token: string, secret: string) => {
    try {
        return jwt.verify(token, secret) as UserPayload;
    } catch (error) {
        console.error("JWT verification failed:", error);
        if (error === "TokenExpiredError") {
            console.error("Token expired at:", error);
        }
        return null;
    }
};