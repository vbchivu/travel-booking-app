import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../config/env";

interface UserPayload {
    id: string;
    role: string;
}

/**
 * Generates an access token and refresh token for a user.
 * @param user - The user payload (id & role).
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
 * @param token - The JWT token to verify.
 * @param secret - The secret key to use for verification.
 */
export const verifyToken = (token: string, secret: string) => {
    try {
        return jwt.verify(token, secret) as UserPayload;
    } catch (error) {
        return null;
    }
};

/**
 * Refreshes an access token using a valid refresh token.
 * @param refreshToken - The user's refresh token.
 */
export const refreshAccessToken = (refreshToken: string) => {
    const decoded = verifyToken(refreshToken, config.refreshTokenSecret);
    if (!decoded) return null;

    return generateTokens({ id: decoded.id, role: decoded.role }).accessToken;
};
