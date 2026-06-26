FROM node:24-alpine AS base
RUN corepack enable && corepack prepare pnpm@11.9.0 --activate

# ── Builder ────────────────────────────────────────────────────────────────────
FROM base AS builder

# Build tools required to compile better-sqlite3 native addon
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Strip dev-only packages; production node_modules (incl. compiled .node binary) stays
RUN pnpm prune --prod

# ── Runner ─────────────────────────────────────────────────────────────────────
FROM base AS runner

WORKDIR /app

# Copy pruned node_modules from builder — includes the compiled better-sqlite3 binary,
# tsx (production dep), and all other runtime dependencies.
# No build tools needed here; the .node binary was already compiled in the builder stage.
COPY --from=builder /app/node_modules ./node_modules

# SvelteKit adapter-node output (includes client assets bundled in build/client)
COPY --from=builder /app/build ./build

# Runtime files
COPY --from=builder /app/package.json ./
COPY --from=builder /app/svelte.config.js ./
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/src/lib/db ./src/lib/db
COPY --from=builder /app/src/lib/config.ts ./src/lib/config.ts

RUN mkdir -p /app/data

RUN addgroup -g 1001 -S nodejs && adduser -S svelte -u 1001
RUN chown -R svelte:nodejs /app
USER svelte

ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_PATH=/app/data/db.sqlite

EXPOSE 3000
VOLUME ["/app/data"]

HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

CMD ["node", "scripts/docker-entrypoint.js"]
