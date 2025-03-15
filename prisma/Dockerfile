FROM node:18-alpine

ARG NODE_ENV=production
# Set working directory specifically to /app/prisma
WORKDIR /app/prisma

# Ensure local binaries (like `prisma`) are on the PATH
ENV PATH="/app/prisma/node_modules/.bin:${PATH}"

# Copy only the prisma folder's package files
COPY prisma/package.json prisma/package-lock.json ./

# Copy schema.prisma (and any other TS/JS files needed for migrations)
COPY prisma/schema.prisma ./
# If you have a client.ts or other code in prisma/, copy them here too:
COPY prisma/client.ts ./
# COPY prisma/tsconfig.json ./

# Install only what's in prisma/package.json
RUN if [ "$NODE_ENV" = "development" ]; then \
        npm install; \
    else \
        npm ci --omit=dev; \
    fi

# Final command: run migrations
CMD ["npx", "prisma", "migrate", "deploy"]
