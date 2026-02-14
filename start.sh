#!/bin/bash
set -e

echo "🚀 Starting MongoDB deployment process..."

echo "📦 Pushing Prisma schema to MongoDB..."
npx prisma db push --skip-generate
echo "✅ Schema pushed to MongoDB"

echo "🌱 Running database seed..."
echo "Current directory: $(pwd)"
echo "Checking if seed.js exists: $(ls -la seed.js || echo 'NOT FOUND')"
node seed.js
echo "✅ Seeding completed"

echo "🚀 Starting server..."
node dist/server.js
