# ============================================================
# Builder stage
# ============================================================
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Install dependencies using bun (faster than copying all files first)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Generate Drizzle schema (if needed) and build
RUN bunx drizzle-kit generate

# Set build-time environment
ENV NODE_ENV=production

# Build Next.js application
RUN bun run build

# ============================================================
# Production stage
# ============================================================
FROM oven/bun:1-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public

# Set permissions for prerender cache
RUN mkdir .next && chown nextjs:nodejs .next

# Copy built application
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["bun", "run", "start"]
