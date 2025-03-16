import { PrismaClient } from "@prisma/client";
import { logger } from "../logging/logger";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

/**
 * Use global instance to prevent creating multiple Prisma clients in dev mode.
 */
const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

/**
 * Graceful shutdown: Ensure Prisma disconnects properly when the process exits.
 */
process.on("SIGINT", async () => {
    logger.info("📌 Prisma Client is disconnecting...");
    await prisma.$disconnect();
    process.exit(0);
});

process.on("SIGTERM", async () => {
    logger.info("📌 Prisma Client is disconnecting...");
    await prisma.$disconnect();
    process.exit(0);
});

export default prisma;
