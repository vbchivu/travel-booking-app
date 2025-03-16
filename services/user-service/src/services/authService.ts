import bcrypt from "bcryptjs";
import { generateTokens, verifyToken } from "@travel-app/shared";
import { config } from "../config/env";
import { createUser, findUserByEmail, findUserById, updateUserRefreshTokens } from "../models/userModel";

/**
 * Registers a new user with a hashed password.
 */
export const registerUser = async (email: string, password: string) => {
    const existingUser = await findUserByEmail(email);
    if (existingUser) return null;

    const hashedPassword = await bcrypt.hash(password, 10);
    return await createUser(email, hashedPassword);
};

/**
 * Authenticates a user and generates JWT tokens.
 */
export const authenticateUser = async (email: string, password: string) => {
    const user = await findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) return null;

    const { accessToken, refreshToken } = generateTokens({ id: user.id, role: "user" });

    // Append this new refresh token to the user's existing tokens
    await updateUserRefreshTokens(user.id, refreshToken);

    return { accessToken, refreshToken, userId: user.id };
};

/**
 * Refreshes an expired access token using a refresh token.
 */
export const refreshAccessToken = async (refreshToken: string) => {
    const decoded = verifyToken(refreshToken, config.refreshTokenSecret as string);
    if (!decoded || typeof decoded !== "object" || !decoded.id) return null;

    const user = await findUserById(decoded.id);
    if (!user || !user.refreshTokens.includes(refreshToken)) return null;

    const { accessToken, refreshToken: newRefreshToken } = generateTokens({ id: user.id, role: "user" });

    // Remove the old refresh token from the array, then add the new one
    await updateUserRefreshTokens(user.id, newRefreshToken, refreshToken);

    return { accessToken, newRefreshToken };
};
