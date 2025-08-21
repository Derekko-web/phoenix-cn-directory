# Phoenix Chinese Directory

Phoenix Chinese Directory - Full-stack bilingual business directory with authentication, built with NestJS and Next.js

A bilingual (Chinese/English) local directory for the Phoenix metro area that helps users quickly discover Chinese businesses, services, events, and community resources.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm 8+
- Docker and Docker Compose

### Setup

#### Option 1: Automated Setup (Recommended)
```bash
git clone https://github.com/Derekko-web/phoenix-cn-directory.git
cd phoenix-cn-directory
chmod +x setup.sh
./setup.sh
```

#### Option 2: Manual Setup
1. **Clone the repository**
```bash
git clone https://github.com/Derekko-web/phoenix-cn-directory.git
cd phoenix-cn-directory
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Start infrastructure services**
```bash
pnpm docker:up
```

4. **Set up the database**
```bash
# Generate Prisma client and set up database
cd packages/api
pnpm db:generate
pnpm db:push
pnpm db:seed
```

5. **Start development servers**
```bash
# From root directory
pnpm dev
```

This will start:
- Frontend: http://localhost:3000
- API: http://localhost:4000
- API Health Check: http://localhost:4000/health

### Services

When you run `pnpm docker:up`, the following services will be available:

- **PostgreSQL + PostGIS**: localhost:5433
- **OpenSearch**: localhost:9200
- **OpenSearch Dashboards**: localhost:5601 (use `pnpm docker:up --profile dashboard`)
- **MinIO**: localhost:9000 (Console: localhost:9001)
- **Redis**: localhost:6379

## 🏗️ Architecture

- **Frontend**: Next.js with TypeScript, Tailwind CSS, and next-intl for i18n
- **Backend**: NestJS with TypeScript and Prisma ORM
- **Database**: PostgreSQL with PostGIS extension
- **Search**: OpenSearch with Chinese/English analyzers
- **Storage**: MinIO (S3-compatible)
- **Cache**: Redis

## ✨ Features

- **Complete Authentication System**: JWT with refresh tokens + Google OAuth 2.0
- **Bilingual Support**: Full English/Chinese internationalization
- **User Management**: Registration, login, profile dashboard
- **Business Directory**: CRUD operations for business listings
- **Photo Management**: Upload and approval system
- **Business Claims**: Verification workflow for business owners
- **Search & Filters**: Advanced search with category and location filters
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 📁 Project Structure

```
phoenix-cn-directory/
├── packages/
│   ├── web/                 # Next.js frontend
│   ├── api/                 # NestJS backend  
│   └── shared/              # Shared types and utilities
├── docker/                  # Docker configurations
├── .github/workflows/       # CI/CD pipelines
└── docker-compose.yml       # Local development services
```

## 🌐 Internationalization

The application supports English and Simplified Chinese:

- **Routes**: `/en/...` and `/zh/...`
- **Content**: Bilingual business listings and UI
- **Search**: Chinese and English analyzers in OpenSearch

## 📦 Available Scripts

From the root directory:

- `pnpm dev` - Start all development servers
- `pnpm build` - Build all packages
- `pnpm test` - Run tests
- `pnpm lint` - Run linting
- `pnpm typecheck` - Run type checking
- `pnpm docker:up` - Start Docker services
- `pnpm docker:down` - Stop Docker services

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:cov
```

## 📊 Health Checks

- Frontend: Visit http://localhost:3000 - should show the homepage
- API: Visit http://localhost:4000/health - should return `{"status":"ok",...}`
- Database: `docker exec phoenix-postgres pg_isready -U phoenix`
- OpenSearch: `curl http://localhost:9200/_cluster/health`

## 🔧 Development

### Database Operations

```bash
# From project root:
# Reset database (drops and recreates)
pnpm --filter api db:reset

# Generate Prisma client after schema changes
pnpm --filter api db:generate

# Push schema changes to database
pnpm --filter api db:push

# Seed database with initial data
pnpm --filter api db:seed

# Or from packages/api directory:
# Reset database
pnpm db:reset

# Generate and push schema
pnpm db:generate && pnpm db:push

# Seed initial data
pnpm db:seed
```

### Adding New Categories

Edit `packages/api/prisma/seed.ts` and run:

```bash
pnpm --filter api db:seed
```

## 🚢 Deployment

The project includes GitHub Actions for CI/CD:

- **Lint & Type Check**: Runs on every push/PR
- **Test**: Runs with PostgreSQL service
- **Build**: Creates production artifacts

## 📝 API Endpoints

- `GET /health` - Health check
- `GET /v1/categories` - Get all categories
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/google` - Google OAuth login
- `GET /profile` - Get user profile
- `POST /claims` - Submit business claim

## 🛠️ Troubleshooting

### Common Setup Issues

**Port already in use errors:**
```bash
# Kill conflicting processes
lsof -ti:3000 | xargs kill -9  # Frontend
lsof -ti:4000 | xargs kill -9  # API
lsof -ti:5433 | xargs kill -9  # PostgreSQL
```

**Database connection errors:**
```bash
# Check if PostgreSQL is running (port 5433)
docker exec phoenix-postgres pg_isready -U phoenix -d phoenix_cn_directory

# Restart database if needed
pnpm docker:down && pnpm docker:up
```

**Missing environment files:**
```bash
# Create frontend environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:4000" > packages/web/.env.local

# API environment file should already exist at packages/api/.env
```

**OpenSearch warnings (can be ignored for basic functionality):**
The Chinese tokenizer error doesn't affect core features. Search functionality will be limited until the proper plugin is installed.

**Build failures:**
```bash
# Try building each package individually
pnpm --filter shared build
pnpm --filter api build  
pnpm --filter web build

# Or build all at once
pnpm build
```

## 📄 License

Private project for Phoenix Chinese Directory.
