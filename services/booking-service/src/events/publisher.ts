// services/booking-service/src/events/publisher.ts
import * as amqp from "amqplib";
import { Channel } from "amqplib";
import { logger } from "@travel-app/shared";
import { config } from "../config/env";

let channel: Channel | null = null;
let connection: amqp.ChannelModel;

/**
 * Establishes connection to RabbitMQ and initializes the publisher.
 * Includes retries with a fixed delay and logs progress.
 */
async function initializeRabbitMQ(retries = 5, delay = 5000): Promise<void> {
    while (retries > 0) {
        try {
            logger.info("🚀 Connecting to RabbitMQ for publishing...");

            connection = await amqp.connect(config.rabbitmqUrl);
            if (!connection) {
                throw new Error("RabbitMQ connection failed");
            }

            channel = await connection.createChannel();
            if (!channel) {
                throw new Error("Failed to create RabbitMQ channel");
            }

            // Ensure exchange exists
            await channel.assertExchange(config.exchangeName, "topic", { durable: true });

            logger.info("✅ RabbitMQ Publisher initialized");
            return;
        } catch (error) {
            logger.error(`❌ RabbitMQ Connection Failed. Retries left: ${retries}`, { error });
            retries -= 1;
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }

    logger.error("❌ RabbitMQ Publisher Connection Failed. No retries left.");
    process.exit(1);
}

/**
 * Publishes an event to RabbitMQ.
 * @param eventType The event type (e.g., "booking.created")
 * @param data The event payload
 */
export async function publishBookingEvent(eventType: string, data: object): Promise<void> {
    // If channel isn't ready, re-initialize
    if (!channel) {
        logger.warn("⚠️ Publisher channel not initialized. Attempting to reconnect...");
        await initializeRabbitMQ();
        if (!channel) {
            logger.error("❌ Failed to initialize channel");
            return;
        }
    }

    try {
        channel.publish(config.exchangeName, eventType, Buffer.from(JSON.stringify(data)), {
            persistent: true,
        });
        logger.info(`📢 Event published: ${eventType}`, { eventData: data });
    } catch (error) {
        logger.error(`❌ Failed to publish event: ${eventType}`, { error });
    }
}

/**
 * Graceful shutdown handling: closes channel & connection.
 */
async function shutdown() {
    logger.info("🚦 Shutting down RabbitMQ publisher...");
    try {
        if (channel) {
            await channel.close();
            logger.info("✅ Publisher channel closed");
        }
        if (connection) {
            await connection.close();
            logger.info("✅ Publisher connection closed");
        }
    } catch (error) {
        logger.error("❌ Error during publisher shutdown", { error });
    } finally {
        process.exit(0);
    }
}

// Handle common termination signals
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Initialize RabbitMQ connection on startup
initializeRabbitMQ().catch((err) => {
    logger.error("❌ Uncaught error in initializeRabbitMQ", { err });
    process.exit(1);
});
