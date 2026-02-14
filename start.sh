#!/bin/bash
set -e

echo "🚀 Starting deployment process..."

echo "📦 Running migrations..."
npx prisma migrate deploy
echo "✅ Migrations completed"

echo "🌱 Running database seed..."
npm run prisma:seed
echo "✅ Seeding completed"

echo "🚀 Starting server..."
node dist/server.js
