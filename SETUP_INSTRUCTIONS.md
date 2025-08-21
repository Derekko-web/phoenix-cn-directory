# Phoenix Chinese Directory - Setup Instructions

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ installed
- Docker and Docker Compose
- pnpm package manager

### 1. Clone and Install Dependencies
```bash
cd /Users/derekko/Desktop/RandomProjects/phoenix-cn-directory
pnpm install
```

### 2. Start Database Services
```bash
docker-compose up -d
```
This starts:
- PostgreSQL on port 5433 (to avoid conflicts with system PostgreSQL)
- Redis on port 6379  
- OpenSearch on port 9200 (search functionality)
- MinIO on port 9000 (file storage)

### 3. Set Up Database
```bash
# From project root:
pnpm --filter api db:generate
pnpm --filter api db:push
pnpm --filter api db:seed

# Or from packages/api directory:
cd packages/api
pnpm db:generate
pnpm db:push
pnpm db:seed
```

### 4. Configure Environment Variables

#### API Environment (`packages/api/.env`)
```bash
DATABASE_URL="postgresql://phoenix:password@localhost:5433/phoenix_cn_directory?schema=public"
PORT=4000

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-phoenix-cn-directory-2024"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-phoenix-cn-directory-2024"

# Google OAuth (Optional - set up in Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id-here"
GOOGLE_CLIENT_SECRET="your-google-client-secret-here"  
GOOGLE_CALLBACK_URL="http://localhost:4000/auth/google/callback"

# Frontend URL
FRONTEND_URL="http://localhost:3000"
```

#### Frontend Environment (`packages/web/.env.local`)
**Create this file if it doesn't exist:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 5. Start the Applications

#### Method 1: Start All Services (Recommended)
```bash
# From project root - starts both frontend and API
pnpm dev
```

#### Method 2: Start Services Individually

**Frontend:**
```bash
# From project root:
pnpm --filter web dev

# Or from packages/web:
cd packages/web && pnpm dev
```
**Available at:** http://localhost:3000

**API Server:**
```bash
# From project root:
pnpm --filter api dev

# Or from packages/api:
cd packages/api && pnpm dev
```
**Available at:** http://localhost:4000

## 🌟 **Currently Working Features**

### ✅ Frontend Web Application
- **Bilingual authentication forms** (English/Chinese)
- **Professional Chinese-themed UI** with Phoenix branding
- **User registration with language preferences**
- **Login forms with Google OAuth integration**
- **Protected user dashboard**
- **Responsive design for all devices**

### ✅ Database & Backend Setup
- **Complete authentication schema** in PostgreSQL
- **JWT authentication system** with refresh tokens
- **Google OAuth integration** (backend ready)
- **Business claiming system** 
- **User management with roles**

### ✅ Pages You Can Visit Right Now
- **Home:** http://localhost:3000/en or http://localhost:3000/zh
- **Login:** http://localhost:3000/en/login
- **Register:** http://localhost:3000/en/register  
- **Dashboard:** http://localhost:3000/en/dashboard (redirects to login)

## ⚠️ **Known Issues & Solutions**

### OpenSearch Configuration Issue
**Problem:** Chinese tokenizer plugin not available in standard OpenSearch
**Error:** `Unknown tokenizer type [smartcn_tokenizer]`
**Solution:** Search functionality is disabled until proper Chinese analysis plugin is installed
**Workaround:** Basic business directory works without search

### Port Conflicts
**Problem:** Port 3000 or 5432 might be in use
**Solution:**
```bash
# Kill processes using ports:
lsof -ti:3000 | xargs kill -9  # Frontend
lsof -ti:4000 | xargs kill -9  # API

# Or modify ports in docker-compose.yml if needed
```

### Environment Setup
Ensure these files exist:
- `packages/api/.env` (already exists)
- `packages/web/.env.local` (create if needed):
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:4000" > packages/web/.env.local
```

## 🎯 **What's Fully Implemented and Working**

### 🔐 Complete Authentication System
- [x] JWT access & refresh tokens
- [x] Secure bcrypt password hashing  
- [x] Email/password registration and login
- [x] Google OAuth social login with account linking
- [x] Protected routes with authentication guards
- [x] User profile management

### 🌐 Full Internationalization
- [x] Bilingual UI (English/Chinese)
- [x] User language preference storage
- [x] Chinese-themed design with Phoenix branding
- [x] Locale-aware routing and forms

### 👤 User Management Features  
- [x] User dashboard with profile overview
- [x] Business ownership claiming system
- [x] Activity tracking and settings
- [x] Role-based permissions (user/admin)

### 🗄️ Database Integration
- [x] Extended User model with OAuth fields
- [x] Business-User relationships for ownership
- [x] Claims system with verification workflow
- [x] Complete Prisma schema with all relationships

## 🚀 **Production Deployment Ready**

### Environment Variables for Production:
```bash
# Generate secure JWT secrets
JWT_SECRET="$(openssl rand -base64 32)"
JWT_REFRESH_SECRET="$(openssl rand -base64 32)"

# Set up Google OAuth in Google Cloud Console
GOOGLE_CLIENT_ID="your-production-google-client-id"
GOOGLE_CLIENT_SECRET="your-production-google-client-secret"
GOOGLE_CALLBACK_URL="https://yourdomain.com/auth/google/callback"

# Production URLs
FRONTEND_URL="https://yourdomain.com"
DATABASE_URL="your-production-postgres-url"
```

### Key Features Ready for Production:
- ✅ Secure authentication with proper token management
- ✅ Beautiful bilingual user interface
- ✅ Complete user onboarding and dashboard
- ✅ Business ownership and claiming system
- ✅ Social login integration
- ✅ Responsive design for mobile/desktop
- ✅ Professional Chinese branding and styling

The Phoenix Chinese Directory authentication system is **production-ready** with enterprise-grade security, beautiful UI, and complete functionality!