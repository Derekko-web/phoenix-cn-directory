import { PrismaClient } from '@prisma/client';
import puppeteer from 'puppeteer';

const prisma = new PrismaClient();

interface BusinessInfo {
  id: string;
  slug: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
}

async function scrapeGoogleImages(searchQuery: string, limit: number = 3): Promise<string[]> {
  let browser;
  
  try {
    console.log(`  🔍 Searching Google Images for: "${searchQuery}"`);
    
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Navigate to Google Images with search query
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&tbm=isch&safe=active`;
    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait for images to load
    await page.waitForSelector('img[data-src], img[src]', { timeout: 10000 });
    
    // Scroll down to load more images
    await page.evaluate(() => {
      window.scrollBy(0, 1000);
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Extract image URLs
    const imageUrls: string[] = await page.evaluate(() => {
      const images = document.querySelectorAll('img[data-src], img[src]');
      const urls: string[] = [];
      
      images.forEach((img: Element) => {
        const imgElement = img as HTMLImageElement;
        let src = imgElement.dataset.src || imgElement.src;
        
        // Filter out small images, icons, and non-relevant images
        if (src && 
            !src.includes('data:') &&
            !src.includes('base64') &&
            !src.includes('logo') &&
            !src.includes('icon') &&
            !src.includes('avatar') &&
            src.includes('http') &&
            imgElement.naturalWidth > 200 &&
            imgElement.naturalHeight > 200) {
          urls.push(src);
        }
      });
      
      return urls;
    });
    
    // Filter and return unique URLs
    const uniqueUrls = [...new Set(imageUrls)].slice(0, limit);
    console.log(`  ✅ Found ${uniqueUrls.length} image URLs`);
    
    return uniqueUrls;
    
  } catch (error) {
    console.error(`  ❌ Error scraping images for "${searchQuery}":`, error.message);
    return [];
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function getBusinessSearchQueries(business: BusinessInfo): Promise<string[]> {
  const queries = [];
  
  // Primary search with name and location
  if (business.address && business.city && business.state) {
    queries.push(`${business.name} ${business.city} ${business.state} restaurant photos`);
    queries.push(`${business.name} ${business.address} ${business.city} Arizona`);
  }
  
  // Secondary search with just name and city
  if (business.city && business.state) {
    queries.push(`${business.name} ${business.city} Arizona photos`);
  }
  
  // Fallback search with just business name
  queries.push(`${business.name} Arizona business photos`);
  
  return queries;
}

async function scrapeActualBusinessImages() {
  console.log('🏢 Starting actual business image scraping from Google Images...');
  
  try {
    // Get all businesses with their location info
    const businesses = await prisma.business.findMany({
      include: {
        localized: true,
        location: true,
        contact: true,
        photos: true
      }
    });
    
    console.log(`Found ${businesses.length} businesses to process`);
    
    for (const business of businesses) {
      const businessName = business.localized[0]?.name || business.slug;
      console.log(`\n📸 Processing: ${businessName}`);
      
      // Skip if business already has many photos
      if (business.photos.length >= 3) {
        console.log(`  ⏭️  Already has ${business.photos.length} photos, skipping`);
        continue;
      }
      
      const businessInfo: BusinessInfo = {
        id: business.id,
        slug: business.slug,
        name: businessName,
        address: business.location?.addressLines[0],
        city: business.location?.city,
        state: business.location?.state,
        phone: business.contact?.phone
      };
      
      // Generate search queries
      const searchQueries = await getBusinessSearchQueries(businessInfo);
      
      let allImageUrls: string[] = [];
      
      // Try each search query until we get enough images
      for (const query of searchQueries) {
        if (allImageUrls.length >= 3) break;
        
        const imageUrls = await scrapeGoogleImages(query, 3);
        allImageUrls = [...allImageUrls, ...imageUrls];
        
        // Add delay between searches to be respectful
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Remove duplicates and limit to 3
      const uniqueUrls = [...new Set(allImageUrls)].slice(0, 3);
      
      if (uniqueUrls.length === 0) {
        console.log(`  ⚠️  No images found for ${businessName}`);
        continue;
      }
      
      // Clear existing photos first
      await prisma.photo.deleteMany({
        where: { businessId: business.id }
      });
      
      // Save new photos to database
      for (let i = 0; i < uniqueUrls.length; i++) {
        const imageUrl = uniqueUrls[i];
        
        try {
          const photo = await prisma.photo.create({
            data: {
              businessId: business.id,
              url: imageUrl,
              storageKey: `google-images/${business.slug}-${i}.jpg`,
              originalName: `${business.slug}-${i}.jpg`,
              mimeType: 'image/jpeg',
              size: 51200, // Default size
              caption: `${businessName} - Photo ${i + 1}`,
              status: 'APPROVED'
            }
          });
          
          console.log(`  ✅ Added image ${i + 1}: ${photo.id}`);
          
        } catch (error) {
          console.error(`  ❌ Failed to save image ${i + 1}:`, error);
        }
      }
      
      console.log(`  🎉 Added ${uniqueUrls.length} actual photos for ${businessName}`);
      
      // Longer delay between businesses to be respectful
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    console.log('\n🎉 Completed actual business image scraping!');
    
  } catch (error) {
    console.error('❌ Error during business image scraping:', error);
    throw error;
  }
}

async function main() {
  await scrapeActualBusinessImages();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });