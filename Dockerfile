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

# Generate Drizzle schema & Build Next.js
RUN bunx drizzle-kit generate
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
# Kita perlu 'src' karena seed.ts biasanya import dari '../src/db'
COPY --from=builder /app/src ./src
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/bun.lock ./bun.lock

# 4. TRICK UNTUK SIZE KECIL: 
# Kita install ulang dependencies versi PRODUCTION saja di runner.
# Ini akan menyertakan bcryptjs & library lain yang dibutuhkan seed,
# tapi TANPA menyertakan devDependencies yang besar (TS, ESLint, dll).
RUN bun install --production

# 5. Berikan izin akses folder
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

# Jalankan server menggunakan node (bawaan dari image bun)
CMD ["node", "server.js"]