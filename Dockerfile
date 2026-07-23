# ============================================================
# Stage 1: Builder
# ============================================================
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Set build-time environment
ENV NODE_ENV=production

# Build Next.js. Drizzle schema sync runs in start.sh when runtime env is available.
RUN bun run build

# ============================================================
# Stage 2: Runner (Optimized & Small)
# ============================================================
FROM oven/bun:1-alpine AS runner

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 1. Setup User demi keamanan
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 2. Salin hasil build standalone Next.js
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# 3. Salin file pendukung SEED agar script bisa jalan
COPY --from=builder /app/src ./src
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/bun.lock ./bun.lock

# 4. Install dependencies (including bcryptjs for auth, drizzle-orm for db)
# We use bun install (not --production) so drizzle-kit CLI is available for migrations at startup.
RUN bun install

# 5. Copy startup script
COPY --from=builder /app/start.sh ./start.sh
RUN chmod +x start.sh

# 6. Berikan izin akses folder
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

# Jalankan server: migrate dulu, baru start
CMD ["./start.sh"]
