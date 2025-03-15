import winston from 'winston';

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
);

// Create logger instance
export const logger = winston.createLogger({
    level: 'info',
    format: logFormat,
    transports: [
        new winston.transports.Console(), // Log to console
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // Log errors
        new winston.transports.File({ filename: 'logs/combined.log' }) // Log everything
    ]
});

// Log unhandled exceptions (recommended for production)
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection:', reason);
});
