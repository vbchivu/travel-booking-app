import amqp, { Channel } from "amqplib";
import { config } from "../config/env"; // ✅ Centralized configuration
import { logger } from "../utils/logger";

let channel: Channel | null = null;

async function startConsumer() {
    try {
        if (!config.rabbitmqUrl) {
            logger.error("❌ RABBITMQ_URL is required but missing.");
            process.exit(1);
        }

        let connection = await amqp.connect(config.rabbitmqUrl);
        channel = await connection.createChannel();
        await channel.assertExchange(config.exchangeName, "topic", { durable: true });

        await channel.assertQueue(config.queueName, { durable: true });
        await channel.bindQueue(config.queueName, config.exchangeName, "booking.created");

        logger.info(`📥 Listening for messages in queue: ${config.queueName}`);

        channel.consume(
            config.queueName,
            async (msg) => {
                if (msg) {
                    const content = msg.content.toString();
                    logger.info(`✅ Received event: booking.created`, { eventData: content });

                    // Simulate processing (replace with actual logic)
                    await new Promise((resolve) => setTimeout(resolve, 1000));

                    if (channel) {
                        channel.ack(msg); // Acknowledge message processing
                    }
                }
            },
            { noAck: false } // Ensures messages are not lost if consumer crashes
        );

        // Graceful shutdown
        process.on("SIGINT", async () => {
            logger.info("🚦 Shutting down RabbitMQ consumer...");
            await channel?.close();
            await connection?.close();
            process.exit(0);
        });

    } catch (error) {
        logger.error("❌ RabbitMQ Consumer Error:", { error });
        setTimeout(startConsumer, 5000); // Retry after 5 seconds
    }
}

// Start RabbitMQ Consumer on startup
startConsumer();
