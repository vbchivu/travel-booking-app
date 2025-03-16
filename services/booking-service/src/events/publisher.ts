// src/events/publisher.ts
import amqp, { Channel } from "amqplib";
import { logger } from "../utils/logger";
import { config } from "../config/env";

let channel: Channel | null = null;
let initializing = false;

async function initializeRabbitMQ() {
    if (initializing) return;
    initializing = true;

    try {
        if (!config.rabbitmqUrl) {
            logger.error("RABBITMQ_URL is required but missing");
            process.exit(1);
        }

        let connection = await amqp.connect(config.rabbitmqUrl);

        connection.on("close", async () => {
            logger.warn("RabbitMQ connection closed. Reconnecting...");
            channel = null;
            await initializeRabbitMQ();
        });

        channel = await connection.createChannel();
        await channel.assertExchange(config.exchangeName, "topic", { durable: true });
        logger.info("✅ RabbitMQ Publisher initialized");

        // Graceful shutdown
        process.on("SIGINT", async () => {
            logger.info("🚦 Closing RabbitMQ Publisher...");
            await channel?.close();
            await connection?.close();
            process.exit(0);
        });
    } catch (error) {
        logger.error("❌ RabbitMQ Publisher Initialization Error:", { error });
        setTimeout(initializeRabbitMQ, 5000); // Retry connection after 5 sec
    } finally {
        initializing = false;
    }
}

export async function publishBookingEvent(eventType: string, data: object) {
    if (!channel) {
        logger.warn("⚠️ Channel not initialized. Attempting to initialize...");
        await initializeRabbitMQ();
        if (!channel) {
            logger.error("❌ Failed to initialize channel");
            return;
        }
    }

    try {
        channel.publish(config.exchangeName, eventType, Buffer.from(JSON.stringify(data)), { persistent: true });
        logger.info(`📢 Event published: ${eventType}`, { eventData: data });
    } catch (error) {
        logger.error(`❌ Failed to publish event: ${eventType}`, { error });
    }
}

// Initialize RabbitMQ connection on startup
initializeRabbitMQ();
