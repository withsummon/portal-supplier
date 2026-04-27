# ... (Builder stage tetap sama)

# ============================================================
# Production stage
# ============================================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Salin public dan static
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

# Salin hasil standalone (Isinya: server.js dan node_modules)
COPY --from=builder /app/.next/standalone ./

RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

# Jalankan server.js yang sekarang ada di root /app
CMD ["node", "server.js"]