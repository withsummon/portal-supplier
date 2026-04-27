# ============================================================
# Stage 1: Builder
# ============================================================
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Salin file dependensi
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Salin semua source code
COPY . .

# Build-time environment
ENV NODE_ENV=production

# Generate Drizzle & Build
RUN bunx drizzle-kit generate
RUN bun run build

# ============================================================
# Stage 2: Runner
# ============================================================
FROM node:20-alpine AS runner

WORKDIR /app

# Set runtime environment
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Security setup
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Salin aset statis
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

# Salin hasil standalone (server.js ada di sini)
COPY --from=builder /app/.next/standalone ./

COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts 
COPY --from=builder /app/drizzle ./drizzle

# Berikan izin akses ke user nextjs
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

# Jalankan server.js
CMD ["node", "server.js"]