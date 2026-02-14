#!/bin/bash
set -e

echo "🚀 Starting deployment process..."

echo "📦 Running migrations..."
npx prisma migrate deploy
echo "✅ Migrations completed"

echo "🌱 Running database seed..."
echo "Current directory: $(pwd)"
echo "Checking if seed.js exists: $(ls -la seed.js || echo 'NOT FOUND')"
node seed.js
echo "✅ Seeding completed"

echo "🚀 Starting server..."
node dist/server.js
