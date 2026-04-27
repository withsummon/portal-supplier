# ============================================================
# Stage 1: Builder
# ============================================================
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# 1. Install dependencies (lebih cepat dengan bun)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# 2. Salin seluruh source code
COPY . .

# 3. Set environment untuk build
ENV NODE_ENV=production

# 4. Jalankan drizzle-kit (jika ada schema yang perlu di-generate)
RUN bunx drizzle-kit generate

# 5. Build Next.js
RUN bun run build

# ============================================================
# Stage 2: Runner
# ============================================================
FROM oven/bun:1-alpine AS runner

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 1. Keamanan: Buat non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 2. Salin hasil output standalone Next.js
# Folder standalone berisi file server.js dan node_modules minimal
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# 3. Salin file tambahan untuk keperluan Seeding/Migration di terminal
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/package.json ./package.json

# 4. Atur kepemilikan folder ke user nextjs
RUN chown -R nextjs:nodejs /app

# 5. Gunakan user non-root
USER nextjs

# 6. Expose port 3000 sesuai ENV PORT
EXPOSE 3000

# 7. Jalankan aplikasi
# Next.js standalone tetap menggunakan node (tersedia di image bun)
CMD ["node", "server.js"]