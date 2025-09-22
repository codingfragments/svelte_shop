# Use official Node.js runtime as base image
FROM node:22.19.0-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:22.19.0-alpine AS runner

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/build ./build
COPY --from=builder /app/static ./static
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/svelte.config.js ./svelte.config.js

# Copy database scripts and source files for runtime
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/src/lib/db ./src/lib/db
COPY --from=builder /app/src/lib/config.ts ./src/lib/config.ts

# Install tsx for running TypeScript in production
RUN npm install tsx

# Create data directory for database
RUN mkdir -p /app/data

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S svelte -u 1001

# Copy and set permissions for entrypoint script
COPY --from=builder /app/scripts/docker-entrypoint.js ./scripts/
RUN chmod +x ./scripts/docker-entrypoint.js

# Change ownership of app directory
RUN chown -R svelte:nodejs /app
USER svelte

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_PATH=/app/data/db.sqlite

# Expose port
EXPOSE 3000

# Add volume for persistent data
VOLUME ["/app/data"]

# Health check - increase start period for database initialization
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application with database initialization
CMD ["node", "scripts/docker-entrypoint.js"]