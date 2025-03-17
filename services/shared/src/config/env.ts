import { log } from "console";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.JWT_SECRET || !process.env.REFRESH_TOKEN_SECRET || !process.env.DATABASE_URL) {
    throw new Error("Missing required environment variables (JWT_SECRET, REFRESH_TOKEN_SECRET, DATABASE_URL)");
}

export const config = {
    jwtSecret: process.env.JWT_SECRET as string,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET as string,
    jwtExpiration: process.env.JWT_EXPIRATION || "15m",
    refreshExpiration: process.env.REFRESH_EXPIRATION || "7d",
    databaseUrl: process.env.DATABASE_URL as string,
    logLevel: process.env.LOG_LEVEL || "info",
};
