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
  
  # Install all dependencies at the root, including @travel-app/shared
  RUN if [ "$NODE_ENV" = "development" ]; then \
        npm install; \
      else \
        npm ci --omit=dev; \
      fi
  
  # Build shared first => produces /app/services/shared/dist
  WORKDIR /app/services/shared
  RUN npm run build
  
  # Build user-service => /app/services/user-service/dist
  WORKDIR /app/services/user-service
  RUN npm run build
  
  # -----------------------------
  # 2) Final Runtime Stage
  # -----------------------------
  FROM node:18-alpine
  WORKDIR /app
  
  # Copy user-service compiled code
  COPY --from=builder /app/services/user-service/dist /app/services/user-service/dist
  
  # Copy shared compiled code as well
  COPY --from=builder /app/services/shared/dist /app/services/shared/dist
  
  # Copy only the necessary node_modules
  COPY --from=builder /app/node_modules /app/node_modules
  # COPY --from=builder /app/services/shared/node_modules /app/services/shared/node_modules
  
  # Copy user-service's package.json
  COPY --from=builder /app/services/user-service/package.json ./package.json
  
  EXPOSE 5000
  
  # Our main server file is inside user-service/dist
  CMD ["node", "services/user-service/dist/server.js"]
  