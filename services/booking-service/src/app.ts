// src/app.ts
import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import bookingRoutes from "./routes/bookingRoutes";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import { logger } from "@travel-app/shared";
import { trackMetrics } from "@travel-app/shared";
import metricsRouter from "./routes/metricsRouter";

const app: Express = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
app.use(trackMetrics);

app.use(metricsRouter);
// REST API Routes
app.use("/bookings", bookingRoutes);

// Middleware to log requests
app.use((req, _res, next) => {
    logger.info(`Incoming Request: ${req.method} ${req.url}`, { ip: req.ip });
    next();
});

// Middleware to log responses
app.use((req, res, next) => {
    res.on("finish", () => {
        logger.info(`Response Sent: ${req.method} ${req.url} - ${res.statusCode}`);
    });
    next();
});

// Initialize GraphQL
let server: ApolloServer;

async function startGraphQL() {
    try {
        server = new ApolloServer({ typeDefs, resolvers });
        await server.start();
        server.applyMiddleware({ app: app as any });

        logger.info(`🚀 GraphQL API available at /graphql`);
    } catch (error) {
        logger.error("❌ Failed to start GraphQL server:", { error });
    }
}

// Start GraphQL
startGraphQL();

// Graceful Shutdown Handling
process.on("SIGINT", async () => {
    logger.info("Shutting down services...");

    if (server) {
        await server.stop();
        logger.info("✅ GraphQL Server stopped.");
    }

    logger.info("✅ All services stopped successfully.");
    process.exit(0);
});

export default app;
