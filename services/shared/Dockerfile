FROM node:18-alpine AS builder

WORKDIR /app

# Copy the monorepo root package.json and lock file
COPY package.json package-lock.json ./

# Copy only the shared package.json
COPY services/shared/package.json ./services/shared/

# Install only this service's dependencies
RUN npm install --prefix services/shared

# Copy the shared service
COPY services/shared/ ./services/shared/

# Debug: List files in the shared directory
RUN ls -la /app/services/shared

# Build the shared service
WORKDIR /app/services/shared
RUN npm run build

FROM node:18-alpine
WORKDIR /app

# Copy built files from the builder
COPY --from=builder /app/services/shared/dist ./dist
COPY --from=builder /app/services/shared/node_modules ./node_modules
COPY --from=builder /app/services/shared/package.json ./package.json

CMD ["node", "dist/index.js"]