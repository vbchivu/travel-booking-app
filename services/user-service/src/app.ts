import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import metricsRouter from "./routes/metricsRouter";
import { trackMetrics } from "@travel-app/shared";
import { logger } from "@travel-app/shared";

const app = express();
app.use(express.json());
app.use(cookieParser());

// Use shared metrics middleware for all routes
app.use(trackMetrics);

// API Endpoints
app.use(metricsRouter);
app.use("/api/auth", authRoutes);

// Middleware to log requests
app.use((req, _res, next) => {
    logger.info(`Incoming Request: ${req.method} ${req.url}`, { ip: req.ip });
    next();
});

// Middleware to log responses
app.use((req, res, next) => {
    res.on("finish", () => {
        logger.info(`Response Sent: ${req.method} ${req.url} - ${res.statusCode}`);
    });
    next();
});

export default app;
