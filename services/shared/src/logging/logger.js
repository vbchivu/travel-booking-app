"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
// Define log format
const logFormat = winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json());
// Create logger instance
exports.logger = winston_1.default.createLogger({
    level: 'info',
    format: logFormat,
    transports: [
        new winston_1.default.transports.Console(), // Log to console
        new winston_1.default.transports.File({ filename: 'logs/error.log', level: 'error' }), // Log errors
        new winston_1.default.transports.File({ filename: 'logs/combined.log' }) // Log everything
    ]
});
// Log unhandled exceptions (recommended for production)
process.on('uncaughtException', (error) => {
    exports.logger.error('Uncaught Exception:', error);
});
process.on('unhandledRejection', (reason) => {
    exports.logger.error('Unhandled Rejection:', reason);
});
