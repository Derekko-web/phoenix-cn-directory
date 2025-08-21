#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Phoenix CN Directory Setup...\n');

const tests = [
  // File structure tests
  {
    name: 'Monorepo structure',
    test: () => {
      const requiredPaths = [
        'package.json',
        'pnpm-workspace.yaml',
        'packages/web/package.json',
        'packages/api/package.json',
        'packages/shared/package.json',
      ];
      
      for (const p of requiredPaths) {
        if (!fs.existsSync(p)) {
          throw new Error(`Missing: ${p}`);
        }
      }
      return 'All required files exist';
    }
  },
  
  // Frontend tests
  {
    name: 'Frontend configuration',
    test: () => {
      const webPkg = JSON.parse(fs.readFileSync('packages/web/package.json'));
      const requiredDeps = ['next', 'react', 'next-intl'];
      
      for (const dep of requiredDeps) {
        if (!webPkg.dependencies[dep]) {
          throw new Error(`Missing dependency: ${dep}`);
        }
      }
      
      const requiredFiles = [
        'packages/web/next.config.js',
        'packages/web/src/middleware.ts',
        'packages/web/src/i18n/request.ts',
        'packages/web/src/i18n/routing.ts',
        'packages/web/src/app/[locale]/layout.tsx',
        'packages/web/src/app/[locale]/page.tsx',
        'packages/web/src/messages/en.json',
        'packages/web/src/messages/zh.json',
      ];
      
      for (const file of requiredFiles) {
        if (!fs.existsSync(file)) {
          throw new Error(`Missing file: ${file}`);
        }
      }
      
      return 'Frontend properly configured with i18n';
    }
  },
  
  // Backend tests
  {
    name: 'Backend configuration',
    test: () => {
      const apiPkg = JSON.parse(fs.readFileSync('packages/api/package.json'));
      const requiredDeps = ['@nestjs/core', '@prisma/client'];
      
      for (const dep of requiredDeps) {
        if (!apiPkg.dependencies[dep]) {
          throw new Error(`Missing dependency: ${dep}`);
        }
      }
      
      const requiredFiles = [
        'packages/api/src/main.ts',
        'packages/api/src/app.module.ts',
        'packages/api/src/common/prisma/prisma.service.ts',
        'packages/api/src/modules/health/health.controller.ts',
        'packages/api/src/modules/categories/categories.controller.ts',
        'packages/api/prisma/schema.prisma',
        'packages/api/prisma/seed.ts',
      ];
      
      for (const file of requiredFiles) {
        if (!fs.existsSync(file)) {
          throw new Error(`Missing file: ${file}`);
        }
      }
      
      return 'Backend properly configured with NestJS and Prisma';
    }
  },
  
  // Database schema tests
  {
    name: 'Database schema',
    test: () => {
      const schema = fs.readFileSync('packages/api/prisma/schema.prisma', 'utf8');
      const requiredModels = [
        'model User',
        'model Business', 
        'model BusinessLocalized',
        'model Category',
        'extensions = [postgis]'
      ];
      
      for (const model of requiredModels) {
        if (!schema.includes(model)) {
          throw new Error(`Missing in schema: ${model}`);
        }
      }
      
      return 'Database schema includes all required models';
    }
  },
  
  // Docker configuration tests
  {
    name: 'Docker configuration',
    test: () => {
      const requiredFiles = [
        'docker-compose.yml',
        'docker/postgres/init.sql',
        'docker/opensearch/opensearch.yml',
        'docker/opensearch/index-template.json',
      ];
      
      for (const file of requiredFiles) {
        if (!fs.existsSync(file)) {
          throw new Error(`Missing file: ${file}`);
        }
      }
      
      const compose = fs.readFileSync('docker-compose.yml', 'utf8');
      const requiredServices = ['postgres', 'opensearch', 'minio', 'redis'];
      
      for (const service of requiredServices) {
        if (!compose.includes(`${service}:`)) {
          throw new Error(`Missing service: ${service}`);
        }
      }
      
      return 'Docker services properly configured';
    }
  },
  
  // CI/CD tests
  {
    name: 'CI/CD configuration',
    test: () => {
      const requiredFiles = [
        '.github/workflows/ci.yml',
        '.eslintrc.js',
        '.prettierrc'
      ];
      
      for (const file of requiredFiles) {
        if (!fs.existsSync(file)) {
          throw new Error(`Missing file: ${file}`);
        }
      }
      
      return 'CI/CD pipeline configured';
    }
  }
];

// Run tests
let passed = 0;
let failed = 0;

for (const test of tests) {
  try {
    const result = test.test();
    console.log(`✅ ${test.name}: ${result}`);
    passed++;
  } catch (error) {
    console.log(`❌ ${test.name}: ${error.message}`);
    failed++;
  }
}

console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log(`
🎉 Setup Complete! 

Next steps:
1. Make sure Docker is running
2. Run: pnpm docker:up
3. Run: cd packages/api && pnpm db:generate && pnpm db:push && pnpm db:seed
4. Run: pnpm dev

Then visit:
- Frontend: http://localhost:3000
- API Health: http://localhost:4000/health
- Categories: http://localhost:4000/v1/categories
  `);
} else {
  console.log('\n❌ Setup has issues. Please review the failed tests above.');
  process.exit(1);
}