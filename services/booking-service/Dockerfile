# -----------------------------
# 1) Builder Stage
# -----------------------------
    FROM node:18-alpine AS builder

    ARG NODE_ENV=production
    WORKDIR /app
    
    # Copy entire monorepo
    COPY package.json package-lock.json ./
    COPY services/ services/
    COPY prisma/ prisma/
    
    RUN if [ "$NODE_ENV" = "development" ]; then \
          npm install; \
        else \
          npm ci --omit=dev; \
        fi
    
    # Build shared
    WORKDIR /app/services/shared
    RUN npm run build || echo "No build step in shared"
    
    # Now build booking-service
    WORKDIR /app/services/booking-service
    RUN npm run build
    
    # -----------------------------
    # 2) Final Stage
    # -----------------------------
    FROM node:18-alpine
    WORKDIR /app
    
    # Copy compiled code
    COPY --from=builder /app/services/booking-service/dist ./dist
    
    # Copy entire node_modules
    COPY --from=builder /app/node_modules ./node_modules
    
    COPY --from=builder /app/services/booking-service/package.json ./package.json
    
    EXPOSE 4001
    CMD ["node", "dist/server.js"]
    