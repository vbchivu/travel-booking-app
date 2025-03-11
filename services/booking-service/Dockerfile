# Use an official Node.js runtime as the base image
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (leverage Docker caching)
COPY ./services/booking-service/package.json ./services/booking-service/package-lock.json ./

# Install dependencies
RUN npm install

# Copy the Prisma schema from the root directory
COPY ./prisma ./prisma

# Copy the rest of the application files
COPY ./services/booking-service ./

# Set Prisma schema path explicitly
ENV PRISMA_SCHEMA_PATH=/app/prisma/schema.prisma

# Generate Prisma Client for this service
RUN npx prisma generate --schema=$PRISMA_SCHEMA_PATH

# Build TypeScript code
RUN npm run build

# Use a lightweight Node.js image for the final container
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy built files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Ensure Prisma schema is available
COPY --from=builder /app/prisma ./prisma 

# Force Prisma Client generation at runtime before the app starts
RUN npx prisma generate --schema=/app/prisma/schema.prisma

# Expose the application port
EXPOSE 4001

# Start the application
CMD ["node", "dist/server.js"]
