import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../config/env";
import { createUser, findUserByEmail, updateUserRefreshToken } from "../models/userModel";


export const registerUser = async (email: string, password: string) => {
    // check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) return null;

    const hashedPassword = await bcrypt.hash(password, 10);
    return await createUser(email, hashedPassword);
};

export const authenticateUser = async (email: string, password: string) => {
    const user = await findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) return null;

    const jwtOptions: SignOptions = { expiresIn: parseInt(config.jwtExpiration as string, 10) };
    const refreshOptions: SignOptions = { expiresIn: parseInt(config.refreshExpiration as string, 10) };

    const token = jwt.sign(
        { userId: user.id, email: user.email },
        config.jwtSecret as string,
        jwtOptions  // Pass options separately
    );

    const refreshToken = jwt.sign(
        { userId: user.id },
        config.refreshTokenSecret as string,
        refreshOptions
    );

    await updateUserRefreshToken(user.id, refreshToken);
    return { token, refreshToken, userId: user.id };
};

export const refreshAccessToken = async (refreshToken: string) => {
    try {
        const decoded: any = jwt.verify(refreshToken, config.refreshTokenSecret as string);
        const user = await findUserByEmail(decoded.userId);
        if (!user || user.refreshToken !== refreshToken) return null;

        const jwtOptions: SignOptions = { expiresIn: parseInt(config.jwtExpiration as string, 10) };

        return jwt.sign(
            { userId: user.id, email: user.email },
            config.jwtSecret as string,
            jwtOptions
        );
    } catch (error) {
        console.error("JWT verification failed:", error);
        return null;
    }
};