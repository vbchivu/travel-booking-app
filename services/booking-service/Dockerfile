FROM node:18-alpine AS builder

ARG NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
COPY services/ services/
COPY prisma/ prisma/

RUN if [ "$NODE_ENV" = "development" ]; then \
        npm install; \
    else \
        npm ci --omit=dev; \
    fi

# Build shared first (in case booking-service depends on it)
WORKDIR /app/services/shared
RUN npm run build || echo "No shared build step"

# Build booking-service
WORKDIR /app/services/booking-service
RUN npm run build

FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app/services/booking-service/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services/booking-service/package.json ./package.json

EXPOSE 4001
CMD ["node", "dist/server.js"]
