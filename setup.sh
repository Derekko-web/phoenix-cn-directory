#!/bin/bash

echo "🚀 Setting up Phoenix Chinese Directory..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install it first:"
    echo "npm install -g pnpm"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

echo "📦 Installing dependencies..."
pnpm install

echo "🐳 Starting Docker services..."
pnpm docker:up

echo "⏳ Waiting for services to be ready..."
sleep 10

echo "🗄️ Setting up database..."
cd packages/api

# Environment files are already set up, but verify frontend env exists
cd ../..
if [ ! -f "packages/web/.env.local" ]; then
    echo "NEXT_PUBLIC_API_URL=http://localhost:4000" > packages/web/.env.local
    echo "📝 Created frontend .env.local file"
fi

cd packages/api

# Generate Prisma client
echo "🔧 Generating Prisma client..."
pnpm db:generate

# Push schema to database (wait a bit more for DB to be ready)
echo "📊 Pushing database schema..."
sleep 5
pnpm db:push

# Seed initial data
echo "🌱 Seeding initial data..."
pnpm db:seed

cd ../..

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Start development servers: pnpm dev"
echo "2. Visit http://localhost:3000 (Frontend)"
echo "3. Visit http://localhost:4000/health (API Health Check)"
echo "4. Visit http://localhost:4000/v1/categories (Categories API)"
echo ""
echo "🔧 Useful commands:"
echo "- Stop services: pnpm docker:down"
echo "- Reset database: pnpm --filter api db:reset"
echo "- View logs: docker compose logs -f"