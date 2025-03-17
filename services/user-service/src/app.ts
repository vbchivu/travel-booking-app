import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import { logger } from "@travel-app/shared";
import metricsRouter from "./routes/metricsRouter";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(metricsRouter);

// Middleware to log requests
app.use((req: { method: any; url: any; ip: any; }, _res: any, next: () => void) => {
    logger.info(`Incoming Request: ${req.method} ${req.url}`, { ip: req.ip });
    next();
});

app.use("/api/auth", authRoutes);

// Middleware to log responses
app.use((req: { method: any; url: any; }, res: { on: (arg0: string, arg1: () => void) => void; statusCode: any; }, next: () => void) => {
    res.on("finish", () => {
        logger.info(`Response Sent: ${req.method} ${req.url} - ${res.statusCode}`);
    });
    next();
});

export default app;
