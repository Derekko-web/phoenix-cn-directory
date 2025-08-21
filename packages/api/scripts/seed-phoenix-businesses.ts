import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Phoenix Chinese business data collected from web research
const phoenixChineseBusinesses = [
  // Chinese Schools/Educational Institutions
  {
    slug: 'contemporary-chinese-school-arizona-ccsa',
    status: 'APPROVED' as const,
    localized: [
      {
        lang: 'en',
        name: 'Contemporary Chinese School of Arizona (CCSA)',
        description: 'Leading non-profit Chinese school in Arizona with over 600 students enrolled. For over 20 years, CCSA has been teaching Chinese language, history and culture, and promoting cultural exchanges and active involvement in local communities.',
        slugLocalized: 'contemporary-chinese-school-arizona'
      },
      {
        lang: 'zh',
        name: '亞利桑那當代中文學校',
        description: '亞利桑那州領先的非營利中文學校，在校學生超過600人。20多年來，CCSA一直致力於教授中文、歷史和文化，促進文化交流並積極參與當地社區活動。',
        slugLocalized: '亞利桑那當代中文學校'
      }
    ],
    contact: {
      phone: '(480) 965-3434',
      email: 'info@ccsarizona.org',
      website: 'https://www.ccsarizona.org'
    },
    location: {
      addressLines: ['ASU Durham Hall', '851 S. Cady Mall'],
      city: 'Tempe',
      state: 'AZ',
      zip: '85281'
    },
    hours: [
      { dayOfWeek: 0, openTime: '09:00', closeTime: '16:00', is24h: false }, // Sunday
    ],
    categories: ['education', 'chinese-school']
  },
  {
    slug: 'hope-chinese-school',
    status: 'APPROVED' as const,
    localized: [
      {
        lang: 'en',
        name: 'Hope Chinese School',
        description: 'Chinese language education school serving the Phoenix community with comprehensive Chinese language and cultural programs.',
        slugLocalized: 'hope-chinese-school'
      },
      {
        lang: 'zh',
        name: '希望中文學校',
        description: '為鳳凰城社區提供全面中文語言和文化課程的中文教育學校。',
        slugLocalized: '希望中文學校'
      }
    ],
    contact: {
      phone: '(480) 759-7106',
      email: 'info@azhopechineseschool.org',
      website: 'https://www.azhopechineseschool.org'
    },
    location: {
      addressLines: ['IRN And CHO Buildings', 'Chandler Gilbert Community College Pecos Campus', '2626 E Pecos Road'],
      city: 'Chandler',
      state: 'AZ',
      zip: '85225'
    },
    hours: [
      { dayOfWeek: 0, openTime: '09:00', closeTime: '15:00', is24h: false }, // Sunday
    ],
    categories: ['education', 'chinese-school']
  },
  {
    slug: 'chinese-linguistic-school-phoenix',
    status: 'APPROVED' as const,
    localized: [
      {
        lang: 'en',
        name: 'Chinese Linguistic School of Phoenix',
        description: 'Founded in 1981, one of the oldest Chinese schools in the Greater Phoenix area. Dedicated to teaching the Chinese language and promoting Chinese culture. Classes held at Mesa Community College.',
        slugLocalized: 'chinese-linguistic-school-phoenix'
      },
      {
        lang: 'zh',
        name: '鳳凰城中文學校',
        description: '成立於1981年，是大鳳凰城地區最古老的中文學校之一。致力於中文教學和中華文化推廣。課程在梅薩社區學院舉行。',
        slugLocalized: '鳳凰城中文學校'
      }
    ],
    contact: {
      phone: '(480) 759-7106',
      email: 'info@clsphoenix.org',
      website: 'https://clsphoenix.org'
    },
    location: {
      addressLines: ['Mesa Community College', '1833 W Southern Ave'],
      city: 'Mesa',
      state: 'AZ',
      zip: '85202'
    },
    hours: [
      { dayOfWeek: 0, openTime: '10:00', closeTime: '15:00', is24h: false }, // Sunday classes
    ],
    categories: ['education', 'chinese-school']
  },
  
  // Chinese Restaurants in Mesa's Asian District
  {
    slug: 'dim-sum-cafe-mesa',
    status: 'APPROVED' as const,
    localized: [
      {
        lang: 'en',
        name: 'Dim Sum Cafe',
        description: 'Authentic dim sum restaurant featuring extensive Chinese menu options and traditional Cantonese-style dim sum.',
        slugLocalized: 'dim-sum-cafe-mesa'
      },
      {
        lang: 'zh',
        name: '點心茶餐廳',
        description: '正宗港式點心餐廳，提供豐富的中式菜單選擇和傳統廣式點心。',
        slugLocalized: '點心茶餐廳'
      }
    ],
    contact: {
      phone: '(480) 558-8292',
      website: 'https://www.yelp.com/biz/dim-sum-cafe-mesa'
    },
    location: {
      addressLines: ['2711 S. Alma School Road', 'Suite 2'],
      city: 'Mesa',
      state: 'AZ',
      zip: '85210'
    },
    hours: [
      { dayOfWeek: 0, openTime: '10:00', closeTime: '21:00', is24h: false },
      { dayOfWeek: 1, openTime: '10:00', closeTime: '21:00', is24h: false },
      { dayOfWeek: 2, openTime: '10:00', closeTime: '21:00', is24h: false },
      { dayOfWeek: 3, openTime: '10:00', closeTime: '21:00', is24h: false },
      { dayOfWeek: 4, openTime: '10:00', closeTime: '21:00', is24h: false },
      { dayOfWeek: 5, openTime: '10:00', closeTime: '21:00', is24h: false },
      { dayOfWeek: 6, openTime: '10:00', closeTime: '21:00', is24h: false },
    ],
    categories: ['restaurant', 'dim-sum', 'cantonese']
  },
  {
    slug: 'happy-baos-mesa',
    status: 'APPROVED' as const,
    localized: [
      {
        lang: 'en',
        name: 'Happy Bao\'s',
        description: 'Located inside Mekong Plaza, specializing in handmade dumplings and traditional Chinese bao buns.',
        slugLocalized: 'happy-baos-mesa'
      },
      {
        lang: 'zh',
        name: '快樂包子',
        description: '位於湄公廣場內，專營手工餃子和傳統中式包子。',
        slugLocalized: '快樂包子'
      }
    ],
    contact: {
      phone: '(480) 897-3292'
    },
    location: {
      addressLines: ['66 S. Dobson Road', 'Suite 112', 'Mekong Plaza'],
      city: 'Mesa',
      state: 'AZ',
      zip: '85202'
    },
    hours: [
      { dayOfWeek: 1, openTime: '11:00', closeTime: '20:00', is24h: false },
      { dayOfWeek: 2, openTime: '11:00', closeTime: '20:00', is24h: false },
      { dayOfWeek: 3, openTime: '11:00', closeTime: '20:00', is24h: false },
      { dayOfWeek: 4, openTime: '11:00', closeTime: '20:00', is24h: false },
      { dayOfWeek: 5, openTime: '11:00', closeTime: '20:00', is24h: false },
      { dayOfWeek: 6, openTime: '11:00', closeTime: '20:00', is24h: false },
      { dayOfWeek: 0, openTime: '11:00', closeTime: '20:00', is24h: false },
    ],
    categories: ['restaurant', 'dumplings', 'chinese']
  },
  {
    slug: 'shaanxi-chinese-restaurant-mesa',
    status: 'APPROVED' as const,
    localized: [
      {
        lang: 'en',
        name: 'Shaanxi Chinese Restaurant',
        description: 'Nestled in Mesa\'s Asian market district, specializing in handmade noodles, barbecue, and other authentic Chinese cuisines from Shaanxi province.',
        slugLocalized: 'shaanxi-chinese-restaurant-mesa'
      },
      {
        lang: 'zh',
        name: '陝西中餐廳',
        description: '位於梅薩亞洲市場區，專營手工麵條、烤肉和其他正宗陝西菜。',
        slugLocalized: '陝西中餐廳'
      }
    ],
    contact: {
      phone: '(480) 820-5588'
    },
    location: {
      addressLines: ['67 N. Dobson Road', 'Suite 109'],
      city: 'Mesa',
      state: 'AZ',
      zip: '85201'
    },
    hours: [
      { dayOfWeek: 1, openTime: '11:00', closeTime: '21:00', is24h: false },
      { dayOfWeek: 2, openTime: '11:00', closeTime: '21:00', is24h: false },
      { dayOfWeek: 3, openTime: '11:00', closeTime: '21:00', is24h: false },
      { dayOfWeek: 4, openTime: '11:00', closeTime: '21:00', is24h: false },
      { dayOfWeek: 5, openTime: '11:00', closeTime: '21:00', is24h: false },
      { dayOfWeek: 6, openTime: '11:00', closeTime: '21:00', is24h: false },
      { dayOfWeek: 0, openTime: '11:00', closeTime: '21:00', is24h: false },
    ],
    categories: ['restaurant', 'noodles', 'chinese', 'shaanxi']
  },
  {
    slug: 'old-town-taste-tempe',
    status: 'APPROVED' as const,
    localized: [
      {
        lang: 'en',
        name: 'Old Town Taste',
        description: 'Authentic Sichuan restaurant featuring spicy Sichuan cuisine with traditional flavors and preparations.',
        slugLocalized: 'old-town-taste-tempe'
      },
      {
        lang: 'zh',
        name: '老鎮味道',
        description: '正宗川菜餐廳，提供傳統四川口味的麻辣菜餚。',
        slugLocalized: '老鎮味道'
      }
    ],
    contact: {
      phone: '(480) 306-7888'
    },
    location: {
      addressLines: ['1845 E. Broadway Road'],
      city: 'Tempe',
      state: 'AZ',
      zip: '85282'
    },
    hours: [
      { dayOfWeek: 1, openTime: '11:00', closeTime: '21:30', is24h: false },
      { dayOfWeek: 2, openTime: '11:00', closeTime: '21:30', is24h: false },
      { dayOfWeek: 3, openTime: '11:00', closeTime: '21:30', is24h: false },
      { dayOfWeek: 4, openTime: '11:00', closeTime: '21:30', is24h: false },
      { dayOfWeek: 5, openTime: '11:00', closeTime: '22:00', is24h: false },
      { dayOfWeek: 6, openTime: '11:00', closeTime: '22:00', is24h: false },
      { dayOfWeek: 0, openTime: '11:00', closeTime: '21:30', is24h: false },
    ],
    categories: ['restaurant', 'sichuan', 'chinese']
  },
  {
    slug: 'mekong-palace-restaurant',
    status: 'APPROVED' as const,
    localized: [
      {
        lang: 'en',
        name: 'Mekong Palace Restaurant',
        description: 'Authentic Chinese cuisine featuring dim sum, live seafood, and traditional dishes including whole roasted pig for special occasions.',
        slugLocalized: 'mekong-palace-restaurant'
      },
      {
        lang: 'zh',
        name: '湄公皇宮餐廳',
        description: '正宗中式料理，提供點心、活海鮮和傳統菜餚，特別場合還有烤乳豬。',
        slugLocalized: '湄公皇宮餐廳'
      }
    ],
    contact: {
      phone: '(480) 777-8989'
    },
    location: {
      addressLines: ['66 S. Dobson Road', 'Mekong Plaza'],
      city: 'Mesa',
      state: 'AZ',
      zip: '85202'
    },
    hours: [
      { dayOfWeek: 0, openTime: '10:00', closeTime: '22:00', is24h: false },
      { dayOfWeek: 1, openTime: '10:00', closeTime: '22:00', is24h: false },
      { dayOfWeek: 2, openTime: '10:00', closeTime: '22:00', is24h: false },
      { dayOfWeek: 3, openTime: '10:00', closeTime: '22:00', is24h: false },
      { dayOfWeek: 4, openTime: '10:00', closeTime: '22:00', is24h: false },
      { dayOfWeek: 5, openTime: '10:00', closeTime: '22:30', is24h: false },
      { dayOfWeek: 6, openTime: '10:00', closeTime: '22:30', is24h: false },
    ],
    categories: ['restaurant', 'dim-sum', 'seafood', 'chinese']
  },
  
  // Asian Grocery Stores
  {
    slug: 'lee-lee-international-chandler',
    status: 'APPROVED' as const,
    localized: [
      {
        lang: 'en',
        name: 'Lee Lee International Supermarket - Chandler',
        description: 'Largest international market in Arizona with products from over 30 countries. Over 175 employees and 200,000 square footage across three Arizona locations.',
        slugLocalized: 'lee-lee-international-chandler'
      },
      {
        lang: 'zh',
        name: '李李國際超市 - 錢德勒店',
        description: '亞利桑那州最大的國際超市，來自30多個國家的產品。超過175名員工，三個亞利桑那州店面總面積達20萬平方英尺。',
        slugLocalized: '李李國際超市-錢德勒店'
      }
    ],
    contact: {
      phone: '(480) 899-9488',
      website: 'http://leeleesupermarket.com'
    },
    location: {
      addressLines: ['2025 W Warner Rd'],
      city: 'Chandler',
      state: 'AZ',
      zip: '85224'
    },
    hours: [
      { dayOfWeek: 0, openTime: '08:00', closeTime: '21:00', is24h: false },
      { dayOfWeek: 1, openTime: '08:00', closeTime: '21:00', is24h: false },
      { dayOfWeek: 2, openTime: '08:00', closeTime: '21:00', is24h: false },
      { dayOfWeek: 3, openTime: '08:00', closeTime: '21:00', is24h: false },
      { dayOfWeek: 4, openTime: '08:00', closeTime: '21:00', is24h: false },
      { dayOfWeek: 5, openTime: '08:00', closeTime: '21:00', is24h: false },
      { dayOfWeek: 6, openTime: '08:00', closeTime: '21:00', is24h: false },
    ],
    categories: ['grocery', 'asian-market', 'international']
  },
  {
    slug: 'lee-lee-international-peoria',
    status: 'APPROVED' as const,
    localized: [
      {
        lang: 'en',
        name: 'Lee Lee International Supermarket - Peoria',
        description: 'Second location of Arizona\'s largest ethnic grocery chain, offering diverse products from Asia and around the world.',
        slugLocalized: 'lee-lee-international-peoria'
      },
      {
        lang: 'zh',
        name: '李李國際超市 - 皮奧里亞店',
        description: '亞利桑那州最大民族雜貨連鎖店的第二家分店，提供來自亞洲和世界各地的多樣化產品。',
        slugLocalized: '李李國際超市-皮奧里亞店'
      }
    ],
    contact: {
      phone: '(623) 334-3888',
      website: 'http://leeleesupermarket.com'
    },
    location: {
      addressLines: ['9648 W Northern Ave'],
      city: 'Peoria',
      state: 'AZ',
      zip: '85345'
    },
    hours: [
      { dayOfWeek: 0, openTime: '08:00', closeTime: '21:00', is24h: false },
      { dayOfWeek: 1, openTime: '08:00', closeTime: '21:00', is24h: false },
      { dayOfWeek: 2, openTime: '08:00', closeTime: '21:00', is24h: false },
      { dayOfWeek: 3, openTime: '08:00', closeTime: '21:00', is24h: false },
      { dayOfWeek: 4, openTime: '08:00', closeTime: '21:00', is24h: false },
      { dayOfWeek: 5, openTime: '08:00', closeTime: '21:00', is24h: false },
      { dayOfWeek: 6, openTime: '08:00', closeTime: '21:00', is24h: false },
    ],
    categories: ['grocery', 'asian-market', 'international']
  },
  {
    slug: 'mekong-supermarket-mesa',
    status: 'APPROVED' as const,
    localized: [
      {
        lang: 'en',
        name: 'Mekong Supermarket',
        description: 'Located within Mekong Plaza, featuring foods and snacks from Vietnam, China, the Philippines and Taiwan.',
        slugLocalized: 'mekong-supermarket-mesa'
      },
      {
        lang: 'zh',
        name: '湄公超市',
        description: '位於湄公廣場內，提供來自越南、中國、菲律賓和台灣的食品和零食。',
        slugLocalized: '湄公超市'
      }
    ],
    contact: {
      phone: '(480) 833-8886'
    },
    location: {
      addressLines: ['66 S. Dobson Road', 'Mekong Plaza'],
      city: 'Mesa',
      state: 'AZ',
      zip: '85202'
    },
    hours: [
      { dayOfWeek: 0, openTime: '09:00', closeTime: '20:00', is24h: false },
      { dayOfWeek: 1, openTime: '09:00', closeTime: '20:00', is24h: false },
      { dayOfWeek: 2, openTime: '09:00', closeTime: '20:00', is24h: false },
      { dayOfWeek: 3, openTime: '09:00', closeTime: '20:00', is24h: false },
      { dayOfWeek: 4, openTime: '09:00', closeTime: '20:00', is24h: false },
      { dayOfWeek: 5, openTime: '09:00', closeTime: '20:00', is24h: false },
      { dayOfWeek: 6, openTime: '09:00', closeTime: '20:00', is24h: false },
    ],
    categories: ['grocery', 'asian-market', 'vietnamese', 'chinese']
  },
  
  // Traditional Chinese Medicine & Healthcare
  {
    slug: 'eastern-medicine-center-phoenix',
    status: 'APPROVED' as const,
    localized: [
      {
        lang: 'en',
        name: 'Eastern Medicine Center',
        description: 'Over 35+ years of experience serving patients in Arizona. Led by Dr. Jing Liu and Dr. Yinan (Kevin) Wang. Over 210,000+ acupuncture treatments performed.',
        slugLocalized: 'eastern-medicine-center-phoenix'
      },
      {
        lang: 'zh',
        name: '東方醫學中心',
        description: '在亞利桑那州為患者服務超過35年經驗。由劉静博士和王藝男（Kevin）博士領導。已進行超過21萬次針灸治療。',
        slugLocalized: '東方醫學中心'
      }
    ],
    contact: {
      phone: '(602) 292-1999',
      website: 'https://easternmedicinecenteraz.com'
    },
    location: {
      addressLines: ['3033 N 7th Ave'],
      city: 'Phoenix',
      state: 'AZ',
      zip: '85013'
    },
    hours: [
      { dayOfWeek: 1, openTime: '09:00', closeTime: '18:00', is24h: false },
      { dayOfWeek: 2, openTime: '09:00', closeTime: '18:00', is24h: false },
      { dayOfWeek: 3, openTime: '09:00', closeTime: '18:00', is24h: false },
      { dayOfWeek: 4, openTime: '09:00', closeTime: '18:00', is24h: false },
      { dayOfWeek: 5, openTime: '09:00', closeTime: '18:00', is24h: false },
      { dayOfWeek: 6, openTime: '09:00', closeTime: '15:00', is24h: false },
    ],
    categories: ['healthcare', 'acupuncture', 'traditional-chinese-medicine']
  },
  {
    slug: 'arizona-acupuncture-chinese-medicine-clinic',
    status: 'APPROVED' as const,
    localized: [
      {
        lang: 'en',
        name: 'Arizona Acupuncture & Chinese Medicine Clinic',
        description: 'Led by Dr. Milton Q. Liu, a Chinese doctor and licensed acupuncturist with over 30 years of medical experience. Offers over 250 Chinese herbs.',
        slugLocalized: 'arizona-acupuncture-chinese-medicine-clinic'
      },
      {
        lang: 'zh',
        name: '亞利桑那針灸中醫診所',
        description: '由劉明頓博士領導，中國醫生和持牌針灸師，擁有超過30年的醫療經驗。提供超過250種中草藥。',
        slugLocalized: '亞利桑那針灸中醫診所'
      }
    ],
    contact: {
      phone: '(602) 274-5556'
    },
    location: {
      addressLines: ['4350 N 19th Ave'],
      city: 'Phoenix',
      state: 'AZ',
      zip: '85015'
    },
    hours: [
      { dayOfWeek: 1, openTime: '09:00', closeTime: '18:00', is24h: false },
      { dayOfWeek: 2, openTime: '09:00', closeTime: '18:00', is24h: false },
      { dayOfWeek: 3, openTime: '09:00', closeTime: '18:00', is24h: false },
      { dayOfWeek: 4, openTime: '09:00', closeTime: '18:00', is24h: false },
      { dayOfWeek: 5, openTime: '09:00', closeTime: '18:00', is24h: false },
      { dayOfWeek: 6, openTime: '09:00', closeTime: '15:00', is24h: false },
    ],
    categories: ['healthcare', 'acupuncture', 'traditional-chinese-medicine']
  },
  {
    slug: 'great-wall-chinese-medicine',
    status: 'APPROVED' as const,
    localized: [
      {
        lang: 'en',
        name: 'Great Wall Chinese Medicine',
        description: 'Dedicated to promoting healthy lifestyle through Traditional Chinese Medicine. Offers holistic diagnostic and treatment methods, including acupuncture, herbal medicine, Tui Na massage, and dietary suggestions.',
        slugLocalized: 'great-wall-chinese-medicine'
      },
      {
        lang: 'zh',
        name: '長城中醫',
        description: '致力於通過傳統中醫推廣健康生活方式。提供整體診斷和治療方法，包括針灸、中草藥、推拿按摩和飲食建議。',
        slugLocalized: '長城中醫'
      }
    ],
    contact: {
      phone: '(602) 456-0288',
      website: 'https://www.chinesedrs.com'
    },
    location: {
      addressLines: ['3302 N 7th St', 'Suite 150'],
      city: 'Phoenix',
      state: 'AZ',
      zip: '85014'
    },
    hours: [
      { dayOfWeek: 1, openTime: '09:00', closeTime: '18:00', is24h: false },
      { dayOfWeek: 2, openTime: '09:00', closeTime: '18:00', is24h: false },
      { dayOfWeek: 3, openTime: '09:00', closeTime: '18:00', is24h: false },
      { dayOfWeek: 4, openTime: '09:00', closeTime: '18:00', is24h: false },
      { dayOfWeek: 5, openTime: '09:00', closeTime: '18:00', is24h: false },
      { dayOfWeek: 6, openTime: '09:00', closeTime: '15:00', is24h: false },
    ],
    categories: ['healthcare', 'acupuncture', 'traditional-chinese-medicine', 'massage']
  }
];

// Category definitions for Chinese businesses
const categories = [
  // Education
  { key: 'education', nameEn: 'Education', nameZh: '教育', icon: '🎓' },
  { key: 'chinese-school', nameEn: 'Chinese School', nameZh: '中文學校', icon: '🏫', parentKey: 'education' },
  
  // Restaurants & Food
  { key: 'restaurant', nameEn: 'Restaurants', nameZh: '餐廳', icon: '🍽️' },
  { key: 'dim-sum', nameEn: 'Dim Sum', nameZh: '點心', icon: '🥟', parentKey: 'restaurant' },
  { key: 'cantonese', nameEn: 'Cantonese Cuisine', nameZh: '粵菜', icon: '🍜', parentKey: 'restaurant' },
  { key: 'sichuan', nameEn: 'Sichuan Cuisine', nameZh: '川菜', icon: '🌶️', parentKey: 'restaurant' },
  { key: 'chinese', nameEn: 'Chinese Cuisine', nameZh: '中菜', icon: '🥢', parentKey: 'restaurant' },
  { key: 'dumplings', nameEn: 'Dumplings', nameZh: '餃子', icon: '🥟', parentKey: 'restaurant' },
  { key: 'noodles', nameEn: 'Noodles', nameZh: '麵食', icon: '🍜', parentKey: 'restaurant' },
  { key: 'shaanxi', nameEn: 'Shaanxi Cuisine', nameZh: '陝西菜', icon: '🍝', parentKey: 'restaurant' },
  { key: 'seafood', nameEn: 'Seafood', nameZh: '海鮮', icon: '🦐', parentKey: 'restaurant' },
  
  // Shopping
  { key: 'grocery', nameEn: 'Grocery Stores', nameZh: '雜貨店', icon: '🛒' },
  { key: 'asian-market', nameEn: 'Asian Market', nameZh: '亞洲市場', icon: '🏪', parentKey: 'grocery' },
  { key: 'international', nameEn: 'International Foods', nameZh: '國際食品', icon: '🌍', parentKey: 'grocery' },
  { key: 'vietnamese', nameEn: 'Vietnamese Products', nameZh: '越南商品', icon: '🇻🇳', parentKey: 'grocery' },
  
  // Healthcare
  { key: 'healthcare', nameEn: 'Healthcare', nameZh: '醫療保健', icon: '🏥' },
  { key: 'acupuncture', nameEn: 'Acupuncture', nameZh: '針灸', icon: '🩹', parentKey: 'healthcare' },
  { key: 'traditional-chinese-medicine', nameEn: 'Traditional Chinese Medicine', nameZh: '中醫', icon: '🌿', parentKey: 'healthcare' },
  { key: 'massage', nameEn: 'Massage Therapy', nameZh: '按摩治療', icon: '💆', parentKey: 'healthcare' }
];

async function seedPhoenixBusinesses() {
  console.log('🌱 Starting to seed Phoenix Chinese businesses...');

  try {
    // First, create categories
    console.log('📚 Creating categories...');
    const categoryMap = new Map<string, string>();
    
    // Create parent categories first
    for (const cat of categories.filter(c => !c.parentKey)) {
      const category = await prisma.category.upsert({
        where: { key: cat.key },
        update: {},
        create: {
          key: cat.key,
          nameEn: cat.nameEn,
          nameZh: cat.nameZh,
          icon: cat.icon
        }
      });
      categoryMap.set(cat.key, category.id);
      console.log(`  ✓ Created parent category: ${cat.nameEn}`);
    }

    // Then create child categories
    for (const cat of categories.filter(c => c.parentKey)) {
      const parentId = categoryMap.get(cat.parentKey);
      const category = await prisma.category.upsert({
        where: { key: cat.key },
        update: {},
        create: {
          key: cat.key,
          nameEn: cat.nameEn,
          nameZh: cat.nameZh,
          icon: cat.icon,
          parentId: parentId
        }
      });
      categoryMap.set(cat.key, category.id);
      console.log(`  ✓ Created child category: ${cat.nameEn}`);
    }

    // Create businesses
    console.log('🏢 Creating businesses...');
    for (const businessData of phoenixChineseBusinesses) {
      console.log(`  Creating: ${businessData.localized[0].name}`);
      
      const business = await prisma.business.create({
        data: {
          slug: businessData.slug,
          status: businessData.status,
          localized: {
            create: businessData.localized
          },
          contact: businessData.contact ? {
            create: businessData.contact
          } : undefined,
          location: businessData.location ? {
            create: businessData.location
          } : undefined,
          hours: {
            create: businessData.hours
          },
          categories: {
            create: businessData.categories.map(categoryKey => ({
              category: {
                connect: { key: categoryKey }
              }
            }))
          }
        }
      });
      
      console.log(`  ✓ Created: ${businessData.localized[0].name}`);
    }

    console.log('🎉 Successfully seeded Phoenix Chinese businesses!');
    console.log(`📊 Created ${categories.length} categories and ${phoenixChineseBusinesses.length} businesses.`);
    
  } catch (error) {
    console.error('❌ Error seeding businesses:', error);
    throw error;
  }
}

async function main() {
  await seedPhoenixBusinesses();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });