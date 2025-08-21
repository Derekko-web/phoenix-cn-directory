import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Optimized category structure - removing duplicates and consolidating
const optimizedCategories = [
  // Main Categories
  { key: 'restaurants', nameEn: 'Restaurants', nameZh: '餐廳', icon: '🍽️', parentKey: null },
  { key: 'grocery', nameEn: 'Grocery & Markets', nameZh: '超市雜貨', icon: '🛒', parentKey: null },
  { key: 'healthcare', nameEn: 'Healthcare', nameZh: '醫療保健', icon: '🏥', parentKey: null },
  { key: 'services', nameEn: 'Professional Services', nameZh: '專業服務', icon: '🔧', parentKey: null },
  { key: 'education', nameEn: 'Education', nameZh: '教育', icon: '🎓', parentKey: null },
  { key: 'community', nameEn: 'Community & Culture', nameZh: '社區文化', icon: '🏛️', parentKey: null },

  // Restaurant Subcategories
  { key: 'chinese-cuisine', nameEn: 'Chinese Cuisine', nameZh: '中式料理', icon: '🥢', parentKey: 'restaurants' },
  { key: 'dim-sum', nameEn: 'Dim Sum', nameZh: '點心', icon: '🥟', parentKey: 'restaurants' },
  { key: 'hotpot', nameEn: 'Hot Pot', nameZh: '火鍋', icon: '🍲', parentKey: 'restaurants' },
  { key: 'noodles', nameEn: 'Noodles', nameZh: '麵食', icon: '🍜', parentKey: 'restaurants' },
  { key: 'sichuan', nameEn: 'Sichuan Cuisine', nameZh: '川菜', icon: '🌶️', parentKey: 'restaurants' },
  { key: 'cantonese', nameEn: 'Cantonese Cuisine', nameZh: '粵菜', icon: '🦐', parentKey: 'restaurants' },
  { key: 'bubble-tea', nameEn: 'Bubble Tea', nameZh: '奶茶', icon: '🧋', parentKey: 'restaurants' },

  // Grocery Subcategories
  { key: 'asian-market', nameEn: 'Asian Markets', nameZh: '亞洲超市', icon: '🏪', parentKey: 'grocery' },
  { key: 'chinese-grocery', nameEn: 'Chinese Specialty', nameZh: '中式食品', icon: '🥡', parentKey: 'grocery' },
  { key: 'butcher', nameEn: 'Meat & Seafood', nameZh: '肉類海鮮', icon: '🥩', parentKey: 'grocery' },

  // Healthcare Subcategories
  { key: 'traditional-chinese-medicine', nameEn: 'Traditional Chinese Medicine', nameZh: '中醫', icon: '🌿', parentKey: 'healthcare' },
  { key: 'acupuncture', nameEn: 'Acupuncture', nameZh: '針灸', icon: '🩹', parentKey: 'healthcare' },
  { key: 'dentist', nameEn: 'Dental Care', nameZh: '牙科', icon: '🦷', parentKey: 'healthcare' },
  { key: 'family-medicine', nameEn: 'Family Medicine', nameZh: '家庭醫學', icon: '👨‍⚕️', parentKey: 'healthcare' },
  { key: 'massage', nameEn: 'Massage Therapy', nameZh: '按摩治療', icon: '💆', parentKey: 'healthcare' },

  // Services Subcategories
  { key: 'real-estate', nameEn: 'Real Estate', nameZh: '房地產', icon: '🏠', parentKey: 'services' },
  { key: 'immigration', nameEn: 'Immigration Law', nameZh: '移民法律', icon: '📋', parentKey: 'services' },
  { key: 'tax-service', nameEn: 'Tax Services', nameZh: '稅務服務', icon: '💰', parentKey: 'services' },
  { key: 'insurance', nameEn: 'Insurance', nameZh: '保險', icon: '🛡️', parentKey: 'services' },
  { key: 'auto-repair', nameEn: 'Auto Repair', nameZh: '汽車維修', icon: '🚗', parentKey: 'services' },
  { key: 'salon', nameEn: 'Beauty & Hair', nameZh: '美容美髮', icon: '💇', parentKey: 'services' },

  // Education Subcategories
  { key: 'chinese-school', nameEn: 'Chinese Language School', nameZh: '中文學校', icon: '📚', parentKey: 'education' },
  { key: 'tutoring', nameEn: 'Tutoring', nameZh: '課後輔導', icon: '📝', parentKey: 'education' },
  { key: 'music-school', nameEn: 'Music & Arts', nameZh: '音樂藝術', icon: '🎵', parentKey: 'education' },
  { key: 'test-prep', nameEn: 'Test Preparation', nameZh: '考試準備', icon: '📊', parentKey: 'education' },

  // Community Subcategories
  { key: 'temple', nameEn: 'Temples', nameZh: '寺廟', icon: '⛩️', parentKey: 'community' },
  { key: 'church', nameEn: 'Churches', nameZh: '教會', icon: '⛪', parentKey: 'community' },
  { key: 'cultural-center', nameEn: 'Cultural Centers', nameZh: '文化中心', icon: '🎭', parentKey: 'community' },
  { key: 'association', nameEn: 'Chinese Associations', nameZh: '華人協會', icon: '🤝', parentKey: 'community' }
];

async function optimizeCategories() {
  console.log('🔧 Starting category optimization...');

  try {
    // First, get all existing businesses with their categories
    const businesses = await prisma.business.findMany({
      include: {
        categories: {
          include: {
            category: true
          }
        }
      }
    });

    // Create mapping for old category keys to new ones
    const categoryMapping = new Map<string, string>();
    
    // Map old keys to new optimized keys
    categoryMapping.set('eat-drink', 'restaurants');
    categoryMapping.set('restaurant', 'restaurants');
    categoryMapping.set('groceries', 'grocery');
    categoryMapping.set('health', 'healthcare');
    categoryMapping.set('tcm', 'traditional-chinese-medicine');
    categoryMapping.set('chinese-restaurant', 'chinese-cuisine');
    categoryMapping.set('chinese', 'chinese-cuisine');
    categoryMapping.set('dumplings', 'dim-sum'); // Dumplings are part of dim sum
    categoryMapping.set('shaanxi', 'noodles'); // Shaanxi is noodle-focused
    categoryMapping.set('seafood', 'chinese-cuisine'); // Consolidate into Chinese cuisine
    categoryMapping.set('international', 'grocery'); // International foods go to grocery
    categoryMapping.set('vietnamese', 'asian-market'); // Vietnamese products to Asian market
    categoryMapping.set('optometrist', 'healthcare'); // Eye care to general healthcare

    console.log('🗑️ Clearing existing categories...');
    
    // Delete all existing categories and their relationships
    await prisma.businessCategory.deleteMany({});
    await prisma.category.deleteMany({});

    console.log('📚 Creating optimized categories...');
    
    // Create new optimized categories
    const categoryIdMap = new Map<string, string>();
    
    // Create parent categories first
    for (const cat of optimizedCategories.filter(c => !c.parentKey)) {
      const category = await prisma.category.create({
        data: {
          key: cat.key,
          nameEn: cat.nameEn,
          nameZh: cat.nameZh,
          icon: cat.icon
        }
      });
      categoryIdMap.set(cat.key, category.id);
      console.log(`  ✓ Created parent category: ${cat.nameEn}`);
    }

    // Create child categories
    for (const cat of optimizedCategories.filter(c => c.parentKey)) {
      const parentId = categoryIdMap.get(cat.parentKey!);
      const category = await prisma.category.create({
        data: {
          key: cat.key,
          nameEn: cat.nameEn,
          nameZh: cat.nameZh,
          icon: cat.icon,
          parentId: parentId
        }
      });
      categoryIdMap.set(cat.key, category.id);
      console.log(`  ✓ Created child category: ${cat.nameEn}`);
    }

    console.log('🔗 Reassigning business categories...');
    
    // Reassign businesses to new categories
    for (const business of businesses) {
      const newCategoryKeys = new Set<string>();
      
      // Map old categories to new ones
      for (const businessCategory of business.categories) {
        const oldKey = businessCategory.category.key;
        let newKey = categoryMapping.get(oldKey) || oldKey;
        
        // If the new key doesn't exist in our optimized structure, find a fallback
        if (!categoryIdMap.has(newKey)) {
          console.log(`  ⚠️ Category ${oldKey} -> ${newKey} not found, using fallback`);
          
          // Fallback logic based on old category
          if (oldKey.includes('restaurant') || oldKey.includes('food') || oldKey.includes('cuisine')) {
            newKey = 'restaurants';
          } else if (oldKey.includes('market') || oldKey.includes('grocery')) {
            newKey = 'grocery';
          } else if (oldKey.includes('health') || oldKey.includes('medical') || oldKey.includes('medicine')) {
            newKey = 'healthcare';
          } else if (oldKey.includes('school') || oldKey.includes('education')) {
            newKey = 'education';
          } else if (oldKey.includes('service') || oldKey.includes('professional')) {
            newKey = 'services';
          } else {
            newKey = 'community'; // Default fallback
          }
        }
        
        newCategoryKeys.add(newKey);
      }
      
      // If no categories were mapped, assign a default based on business name
      if (newCategoryKeys.size === 0) {
        console.log(`  ⚠️ No categories for ${business.slug}, assigning default`);
        newCategoryKeys.add('restaurants'); // Default for most businesses
      }
      
      // Create new business category relationships
      for (const categoryKey of newCategoryKeys) {
        const categoryId = categoryIdMap.get(categoryKey);
        if (categoryId) {
          await prisma.businessCategory.create({
            data: {
              businessId: business.id,
              categoryId: categoryId
            }
          });
        }
      }
      
      console.log(`  ✓ Updated categories for: ${business.slug} -> [${Array.from(newCategoryKeys).join(', ')}]`);
    }

    console.log('🎉 Category optimization completed!');
    console.log(`📊 Created ${optimizedCategories.length} optimized categories`);
    console.log(`🔗 Reassigned ${businesses.length} businesses to new categories`);
    
  } catch (error) {
    console.error('❌ Error during category optimization:', error);
    throw error;
  }
}

async function main() {
  await optimizeCategories();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });