import bcrypt from "bcryptjs";
import { generateTokens, verifyToken } from "@travel-app/shared";
import { config } from "../config/env";
import { createUser, findUserByEmail, updateUserRefreshToken } from "../models/userModel";

/**
 * Registers a new user with a hashed password.
 * @param email - User's email.
 * @param password - User's plain text password.
 * @returns The created user or `null` if user already exists.
 */
export const registerUser = async (email: string, password: string) => {
    const existingUser = await findUserByEmail(email);
    if (existingUser) return null;

    const hashedPassword = await bcrypt.hash(password, 10);
    return await createUser(email, hashedPassword);
};

/**
 * Authenticates a user and generates JWT tokens.
 * @param email - User's email.
 * @param password - User's plain text password.
 * @returns Tokens and userId or `null` if authentication fails.
 */
export const authenticateUser = async (email: string, password: string) => {
    const user = await findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) return null;

    // Generate tokens using tokenService
    const { accessToken, refreshToken } = generateTokens({ id: user.id, role: "user" });

    // Store refresh token securely in the database
    await updateUserRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken, userId: user.id };
};

/**
 * Refreshes an expired access token using a refresh token.
 * @param refreshToken - The user's refresh token.
 * @returns A new access token or `null` if invalid.
 */
export const refreshAccessToken = async (refreshToken: string) => {
    const decoded = verifyToken(refreshToken, config.refreshTokenSecret);
    if (!decoded) return null;

    const user = await findUserByEmail(decoded.id);
    if (!user || user.refreshToken !== refreshToken) return null;

    return generateTokens({ id: user.id, role: "user" }).accessToken;
};
