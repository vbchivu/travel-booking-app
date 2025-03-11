import dotenv from "dotenv";

dotenv.config();

if (!process.env.JWT_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("Missing JWT_SECRET or REFRESH_TOKEN_SECRET in environment variables");
}

export const config = {
    port: process.env.PORT || "5000",
    jwtSecret: process.env.JWT_SECRET as string,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET as string,
    jwtExpiration: process.env.JWT_EXPIRATION || "15m",
    refreshExpiration: process.env.REFRESH_EXPIRATION || "7d",
};
