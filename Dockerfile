# syntax=docker/dockerfile:1

# ---------- Build Stage ----------
FROM node:20-alpine AS builder

# تثبيت أدوات أساسية + OpenSSL لتجنب Prisma warnings
RUN apk add --no-cache bash openssl git

WORKDIR /app

# نسخ package.json + package-lock.json
COPY package.json package-lock.json* ./

# تثبيت dependencies
RUN npm ci

# نسخ الكود المصدر
COPY prisma ./prisma
COPY tsconfig.json ./
COPY src ./src
COPY frontend ./frontend

# Generate Prisma client + build TypeScript
RUN npx prisma generate
RUN npm run build

# Build frontend
WORKDIR /app/frontend
RUN npm ci
RUN npm run build

# ---------- Runtime Stage ----------
FROM node:20-slim

# تثبيت OpenSSL runtime libraries لـ Prisma compatibility (Debian already has OpenSSL 1.1)
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV NODE_ENV=production

# نسخ node_modules + dist + prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/frontend/dist ./frontend/dist
COPY package.json ./

# Expose port app
EXPOSE 3000

# CMD مع Prisma migrate + تشغيل السيرفر
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
