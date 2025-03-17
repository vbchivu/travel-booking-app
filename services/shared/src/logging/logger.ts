import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { config } from "../config/env"; // Import shared environment config

// Define available log levels
const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
};

// Validate and apply log level
const logLevel = Object.keys(logLevels).includes(config.logLevel) ? config.logLevel : "info";

// Create log format
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }), // Include stack trace in errors
    winston.format.json()
);

// Console log format (with colors for readability)
const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.printf(({ level, message, timestamp }) => {
        return `[${timestamp}] ${level}: ${message}`;
    })
);

// Configure file rotation for logs
const dailyRotateFileTransport = new DailyRotateFile({
    dirname: "logs",
    filename: "app-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    maxSize: "20m",
    maxFiles: "14d",
    level: logLevel, // Log level from config
});

export const logger = winston.createLogger({
    level: logLevel,
    levels: logLevels,
    format: logFormat,
    transports: [
        new winston.transports.Console({
            format: consoleFormat,
        }),
        dailyRotateFileTransport,
        new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    ],
});

// Log unhandled exceptions & rejections
process.on("uncaughtException", (error) => {
    logger.error("🔥 Uncaught Exception:", { message: error.message, stack: error.stack });
});

process.on("unhandledRejection", (reason) => {
    logger.error("⚠️ Unhandled Rejection:", { reason });
});

// Middleware to log incoming requests
export const requestLogger = (req: { method: string; url: string }, res: any, next: () => void) => {
    logger.info(`Incoming request: ${req.method} ${req.url}`);
    next();
};

// Log loaded config
logger.info(`🚀 Logger initialized with level: ${logLevel}`);
