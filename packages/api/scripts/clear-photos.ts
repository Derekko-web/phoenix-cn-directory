import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearExistingPhotos() {
  console.log('🗑️  Clearing existing photos...');
  
  try {
    const result = await prisma.photo.deleteMany({
      where: {
        storageKey: {
          startsWith: 'external/'
        }
      }
    });
    
    console.log(`✅ Deleted ${result.count} existing photos`);
    
  } catch (error) {
    console.error('❌ Error clearing photos:', error);
    throw error;
  }
}

async function main() {
  await clearExistingPhotos();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });