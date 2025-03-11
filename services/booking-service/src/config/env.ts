// src/config/env.ts
import dotenv from "dotenv";

dotenv.config();

if (!process.env.RABBITMQ_URL) {
    console.error("RABBITMQ_URL is required");
    process.exit(1);
}

export const config = {
    rabbitmqUrl: process.env.RABBITMQ_URL,
    exchangeName: "booking_events",
    queueName: "booking_queue",
};
