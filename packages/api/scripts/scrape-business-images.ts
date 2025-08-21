import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface BusinessImageSources {
  businessName: string;
  businessSlug: string;
  address: string;
  phone?: string;
  website?: string;
  searchTerms: string[];
}

// More specific business images that better match actual business types
const businessImageUrls: Record<string, string[]> = {
  // Chinese Schools - more specific educational images
  'contemporary-chinese-school-arizona-ccsa': [
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=60', // Chinese classroom with students
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60'   // People studying together
  ],
  'hope-chinese-school': [
    'https://images.unsplash.com/photo-1606187781007-0d499eab27b8?w=800&auto=format&fit=crop&q=60', // Chinese calligraphy close-up
    'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&auto=format&fit=crop&q=60'  // Student learning
  ],
  'chinese-linguistic-school-phoenix': [
    'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&auto=format&fit=crop&q=60', // Language classroom
    'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=800&auto=format&fit=crop&q=60'  // Books and learning
  ],

  // Chinese Restaurants - more specific dishes and restaurant images
  'dim-sum-cafe-mesa': [
    'https://images.unsplash.com/photo-1496412705862-e0fed3f338e0?w=800&auto=format&fit=crop&q=60', // Steamed dim sum buns
    'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=800&auto=format&fit=crop&q=60', // Dim sum restaurant setting
    'https://images.unsplash.com/photo-1601714404629-c4c76b8e01b5?w=800&auto=format&fit=crop&q=60'  // Various dim sum dishes
  ],
  'happy-baos-mesa': [
    'https://images.unsplash.com/photo-1496412705862-e0fed3f338e0?w=800&auto=format&fit=crop&q=60', // Steamed buns close-up
    'https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?w=800&auto=format&fit=crop&q=60', // Dumplings and buns
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop&q=60'  // Asian food preparation
  ],
  'shaanxi-chinese-restaurant-mesa': [
    'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&auto=format&fit=crop&q=60', // Hand-pulled noodles process
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&auto=format&fit=crop&q=60', // Chinese noodle bowl
    'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=800&auto=format&fit=crop&q=60'  // Chinese barbecue/meat dishes
  ],
  'old-town-taste-tempe': [
    'https://images.unsplash.com/photo-1606471191009-63d8b9c40cfe?w=800&auto=format&fit=crop&q=60', // Spicy Sichuan dish
    'https://images.unsplash.com/photo-1582169296120-2fc4ed32c5b2?w=800&auto=format&fit=crop&q=60', // Chinese hot pot or spicy food
    'https://images.unsplash.com/photo-1563379091339-03246963d29a?w=800&auto=format&fit=crop&q=60'  // Traditional Chinese dishes
  ],
  'mekong-palace-restaurant': [
    'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&auto=format&fit=crop&q=60', // Seafood dishes
    'https://images.unsplash.com/photo-1563379091339-03246963d29a?w=800&auto=format&fit=crop&q=60', // Chinese banquet style
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=60'  // Elegant restaurant interior
  ],

  // Asian Grocery Stores - more specific supermarket images
  'lee-lee-international-chandler': [
    'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=60', // Asian grocery aisle with products
    'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&auto=format&fit=crop&q=60', // Fresh produce section
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=60'  // Asian packaged foods
  ],
  'lee-lee-international-peoria': [
    'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=60', // Asian grocery aisle 
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=60', // Supermarket interior
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=60'  // International products
  ],
  'mekong-supermarket-mesa': [
    'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=60', // Asian grocery shelves
    'https://images.unsplash.com/photo-1555487505-50d9ac4799fb?w=800&auto=format&fit=crop&q=60', // Asian market atmosphere
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=60'  // Asian food products
  ],

  // Traditional Chinese Medicine - more specific medical and herbal images
  'eastern-medicine-center-phoenix': [
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&auto=format&fit=crop&q=60', // Acupuncture needles
    'https://images.unsplash.com/photo-1599662875272-64de8dd8ad0d?w=800&auto=format&fit=crop&q=60', // Chinese herbal medicine
    'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccf?w=800&auto=format&fit=crop&q=60'  // Traditional medicine clinic
  ],
  'arizona-acupuncture-chinese-medicine-clinic': [
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&auto=format&fit=crop&q=60', // Acupuncture treatment
    'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&auto=format&fit=crop&q=60', // Dried Chinese herbs
    'https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?w=800&auto=format&fit=crop&q=60'  // Medical consultation room
  ],
  'great-wall-chinese-medicine': [
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&auto=format&fit=crop&q=60', // Acupuncture session
    'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&auto=format&fit=crop&q=60', // Traditional herbs
    'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=800&auto=format&fit=crop&q=60'  // Massage therapy room
  ]
};

async function getImageSize(url: string): Promise<number> {
  // For simplicity, return a default size - in production, you'd get the actual size
  return 1024 * 50; // 50KB default
}

async function scrapeAndSaveBusinessImages() {
  console.log('🖼️  Starting business image scraping...');
  
  try {
    // Get all businesses that don't have photos
    const businesses = await prisma.business.findMany({
      include: {
        photos: true,
        localized: true
      }
    });

    const businessesWithoutPhotos = businesses.filter(b => b.photos.length === 0);
    console.log(`Found ${businessesWithoutPhotos.length} businesses without photos`);

    for (const business of businessesWithoutPhotos) {
      console.log(`\n📸 Processing: ${business.localized[0]?.name || business.slug}`);
      
      const imageUrls = businessImageUrls[business.slug] || [];
      
      if (imageUrls.length === 0) {
        console.log(`  ⚠️  No sample images defined for ${business.slug}`);
        continue;
      }

      for (let i = 0; i < imageUrls.length; i++) {
        const imageUrl = imageUrls[i];
        console.log(`  📥 Adding image ${i + 1}/${imageUrls.length}: ${imageUrl}`);
        
        try {
          // Get the image size (simplified)
          const imageSize = await getImageSize(imageUrl);

          // Create the photo record with the URL
          const photo = await prisma.photo.create({
            data: {
              businessId: business.id,
              url: imageUrl,
              storageKey: `external/${business.slug}-${i}.jpg`,
              originalName: `${business.slug}-${i}.jpg`,
              mimeType: 'image/jpeg',
              size: imageSize,
              caption: `${business.localized[0]?.name || business.slug} - Image ${i + 1}`,
              status: 'APPROVED'
            }
          });
          
          console.log(`  ✅ Created photo record: ${photo.id}`);
          
        } catch (error) {
          console.error(`  ❌ Failed to create photo record for ${imageUrl}:`, error);
        }
      }
      
      // Add a small delay to be respectful to image sources
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n🎉 Image scraping completed!');
    
  } catch (error) {
    console.error('❌ Error during image scraping:', error);
    throw error;
  }
}

async function main() {
  await scrapeAndSaveBusinessImages();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });