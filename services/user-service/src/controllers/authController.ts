import { Request, Response } from "express";
import { registerUser, authenticateUser, refreshAccessToken } from "../services/authService";

export const signup = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: "Missing credentials" });
        return;
    }

    try {
        const user = await registerUser(email, password);
        if (!user) {
            res.status(409).json({ message: "User already exists" });
            return;
        }
        res.status(201).json({ message: "User created", userId: user.id });
    } catch (error) {
        res.status(500).json({ message: "Error creating user" });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const authData = await authenticateUser(email, password);

    if (!authData) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }

    // Send the refresh token in an HTTP-only cookie
    res.cookie("refreshToken", authData.refreshToken, { httpOnly: true, secure: true, sameSite: "strict" });
    res.json({ accessToken: authData.accessToken, userId: authData.userId });
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        res.status(401).json({ message: "No refresh token" });
        return;
    }

    const tokenData = await refreshAccessToken(refreshToken);
    if (!tokenData) {
        res.status(403).json({ message: "Invalid refresh token" });
        return;
    }

    // Set the new refresh token in the cookie
    res.cookie("refreshToken", tokenData.newRefreshToken, { httpOnly: true, secure: true, sameSite: "strict" });
    res.json({ accessToken: tokenData.accessToken });
};
