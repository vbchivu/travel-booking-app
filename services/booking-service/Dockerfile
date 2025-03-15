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

WORKDIR /app/services/booking-service
RUN npm run build

FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app/services/booking-service/dist /app/services/booking-service/dist

COPY --from=builder /app/node_modules /app/node_modules_temp
RUN rm -rf /app/node_modules_temp/@travel-app/shared
COPY --from=builder /app/services/shared/dist /app/node_modules_temp/@travel-app/shared
RUN mv /app/node_modules_temp /app/node_modules

EXPOSE 4001
CMD ["node", "/app/services/booking-service/dist/server.js"]
