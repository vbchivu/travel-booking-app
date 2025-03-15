# Use Node.js base image
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

WORKDIR /app/services/shared
RUN npm run build

FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app/services/shared/dist ./dist
COPY --from=builder /app/services/shared/node_modules ./node_modules
COPY --from=builder /app/services/shared/package.json ./package.json

CMD ["node", "dist/index.js"]
