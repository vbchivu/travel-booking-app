FROM node:18-alpine

ARG NODE_ENV=production

# Set working directory specifically to /app/prisma
WORKDIR /app/prisma

# Ensure local binaries (like `prisma`) are on the PATH
ENV PATH="/app/prisma/node_modules/.bin:${PATH}"

# Copy only the prisma folder's package files
COPY prisma/package.json ./

# Install only what's in prisma/package.json
RUN if [ "$NODE_ENV" = "development" ]; then \
        npm install; \
    else \
        npm ci --omit=dev; \
    fi

# Copy schema.prisma (and any other TS/JS files needed for migrations)
COPY prisma/schema.prisma ./
COPY prisma/tsconfig.json ./

# Generate Prisma Client (Before Migrations)
RUN npx prisma generate

# Apply migrations with drift detection
CMD ["sh", "-c", " \
    echo 'Checking for database drift...'; \
    npx prisma migrate status || echo 'No drift detected'; \
    \
    if [ \"$NODE_ENV\" = \"production\" ]; then \
        echo 'Applying pending migrations...'; \
        npx prisma migrate deploy; \
    else \
        echo 'Applying development migrations...'; \
        npx prisma migrate dev --name init; \
        npx prisma generate; \
    fi; \
    \
    echo 'Starting database migration container...'; \
    tail -f /dev/null \
"]