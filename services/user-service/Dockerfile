FROM node:18-alpine AS builder

ARG NODE_ENV=production
WORKDIR /app

# 1. Copy entire monorepo
COPY package.json package-lock.json ./
COPY services/ services/
COPY prisma/ prisma/

# 2. Install all deps (monorepo root)
RUN if [ "$NODE_ENV" = "development" ]; then \
        npm install; \
    else \
        npm ci --omit=dev; \
    fi

# 3. Compile the prisma package
WORKDIR /app/prisma
RUN npm run build || echo "No build step for prisma"

# 4. Compile shared (if needed)
WORKDIR /app/services/shared
RUN npm run build || echo "No build step for shared"

# 5. Now compile user-service
WORKDIR /app/services/user-service
RUN npm run build

FROM node:18-alpine
WORKDIR /app

# Copy compiled user-service
COPY --from=builder /app/services/user-service/dist ./dist
# Copy entire root node_modules to final container
COPY --from=builder /app/node_modules ./node_modules
# Optional: copy user-service's package.json
COPY --from=builder /app/services/user-service/package.json ./package.json

EXPOSE 5000
CMD ["node", "dist/server.js"]
