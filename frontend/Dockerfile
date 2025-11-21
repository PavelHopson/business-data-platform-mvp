# Используем BuildKit для ускорения
# syntax=docker/dockerfile:1.4

FROM node:18-alpine AS base

# Устанавливаем зависимости для оптимизации (если нужны)
# RUN apk add --no-cache libc6-compat

FROM base AS deps
WORKDIR /app

# Копируем только package.json для кэширования зависимостей
COPY business-analysis-service/package*.json ./

# Устанавливаем все зависимости (включая dev) для сборки
RUN npm ci --no-audit --no-fund --prefer-offline

FROM base AS builder
WORKDIR /app

# Копируем зависимости
COPY --from=deps /app/node_modules ./node_modules

# Копируем исходный код
COPY business-analysis-service/ .

# Оптимизация сборки
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV NODE_ENV=production

# Используем быструю сборку с дополнительными оптимизациями
RUN npm run build:fast

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]