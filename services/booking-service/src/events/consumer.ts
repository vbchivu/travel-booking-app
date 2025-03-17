// services/booking-service/src/events/consumer.ts
import * as amqp from "amqplib";
import { Channel } from "amqplib";
import { config } from "../config/env";
import { logger } from "@travel-app/shared";

let channel: Channel | null = null;
let connection: amqp.ChannelModel;

/**
 * Connects to RabbitMQ and sets up the consumer.
 * Includes retries with a fixed delay and logs progress.
 */
async function startConsumer(retries = 5, delay = 5000): Promise<void> {
    while (retries > 0) {
        try {
            logger.info("🚀 Connecting to RabbitMQ...");

            // Attempt to connect
            connection = await amqp.connect(config.rabbitmqUrl);
            if (!connection) {
                throw new Error("RabbitMQ connection failed");
            }

            // Create the channel
            channel = await connection.createChannel();
            if (!channel) {
                throw new Error("Failed to create RabbitMQ channel");
            }

            // Ensure the exchange and queue exist
            await channel.assertExchange(config.exchangeName, "topic", { durable: true });
            await channel.assertQueue(config.queueName, { durable: true });
            await channel.bindQueue(config.queueName, config.exchangeName, "booking.created");

            logger.info(`📥 Listening for messages in queue: ${config.queueName}`);

            // Optionally limit the number of unacknowledged messages. 
            // This is often considered a best practice to avoid overwhelming consumers.
            // channel.prefetch(1);

            // Consume messages
            channel.consume(
                config.queueName,
                async (msg) => {
                    if (msg) {
                        try {
                            const content = msg.content.toString();
                            logger.info(`✅ Received event: booking.created`, { eventData: content });

                            // Simulate asynchronous processing (replace with actual logic)
                            await new Promise((resolve) => setTimeout(resolve, 1000));

                            // Acknowledge message
                            if (channel) {
                                channel.ack(msg);
                            } else {
                                logger.error("❌ Channel is null, cannot acknowledge message");
                            }
                        } catch (error) {
                            logger.error("❌ Error processing event", { error });
                        }
                    }
                },
                { noAck: false }
            );

            // If successful, break out of the retry loop
            return;
        } catch (error) {
            logger.error(`❌ RabbitMQ Consumer Error. Retries left: ${retries}`, { error });
            retries -= 1;
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }

    logger.error("❌ RabbitMQ Consumer Connection Failed. No retries left.");
    process.exit(1);
}

/**
 * Graceful shutdown: closes channel & connection.
 */
async function shutdown() {
    logger.info("🚦 Shutting down RabbitMQ consumer...");
    try {
        if (channel) {
            await channel.close();
            logger.info("✅ Consumer channel closed");
        }
        if (connection) {
            await connection.close();
            logger.info("✅ Consumer connection closed");
        }
    } catch (error) {
        logger.error("❌ Error during consumer shutdown", { error });
    } finally {
        process.exit(0);
    }
}

// Handle common termination signals
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Start consumer on startup
startConsumer().catch((err) => {
    logger.error("❌ Uncaught error in startConsumer", { err });
    process.exit(1);
});
