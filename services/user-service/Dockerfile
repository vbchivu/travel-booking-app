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
  
  # Install all dependencies for all workspaces
  RUN if [ "$NODE_ENV" = "development" ]; then \
          npm install; \
        else \
          npm ci --omit=dev; \
        fi
  
  # Build shared first (ensuring compiled output in /app/services/shared/dist)
  WORKDIR /app/services/shared
  RUN npm run build
  
  # Build user-service (compiled output in /app/services/user-service/dist)
  WORKDIR /app/services/user-service
  RUN npm run build
  
  # -----------------------------
  # 2) Final Runtime Stage
  # -----------------------------
  FROM node:18-alpine
  WORKDIR /app
  
  # Copy user-service compiled code
  COPY --from=builder /app/services/user-service/dist /app/services/user-service/dist
  
  # Copy node_modules from builder into a temporary folder
  COPY --from=builder /app/node_modules /app/node_modules_temp
  
  # Remove the conflicting shared module from the temporary node_modules
  RUN rm -rf /app/node_modules_temp/@travel-app/shared
  
  # Copy the freshly built shared module into the temporary node_modules
  COPY --from=builder /app/services/shared/dist /app/node_modules_temp/@travel-app/shared
  
  # Move the temporary node_modules to the final location
  RUN mv /app/node_modules_temp /app/node_modules
  
  EXPOSE 5000
  
  ENV JWT_SECRET=${JWT_SECRET}
  # Start the server from user-service's compiled output
  CMD ["node", "/app/services/user-service/dist/server.js"]
  