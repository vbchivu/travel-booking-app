import { PrismaClient } from "@prisma/client";
import { logger } from "../logging/logger";
import { config } from "../config/env"; // ✅ Use centralized config

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

const prisma = globalForPrisma.prisma ??
    new PrismaClient({
        datasources: { db: { url: config.databaseUrl } }, // 🔥 Uses central config
        log: ["query", "info", "warn", "error"],
    });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

/**
 * Graceful shutdown: Ensure Prisma disconnects properly when the process exits.
 */
const disconnectPrisma = async () => {
    try {
        logger.info("📌 Prisma Client is disconnecting...");
        await prisma.$disconnect();
        logger.info("✅ Prisma Client disconnected successfully.");
    } catch (error) {
        logger.error("❌ Error during Prisma disconnect:", { error });
    }
};

process.on("SIGINT", disconnectPrisma);
process.on("SIGTERM", disconnectPrisma);

// Handle Prisma connection errors
prisma.$connect()
    .then(() => logger.info("✅ Prisma connected to database"))
    .catch((error) => {
        logger.error("❌ Failed to connect to database", { error });
        process.exit(1);
    });

export default prisma;
