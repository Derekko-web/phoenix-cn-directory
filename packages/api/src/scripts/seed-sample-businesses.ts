import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleBusinesses = [
  {
    nameEn: "Phoenix Chinese Cultural Center",
    nameZh: "凤凰城华人文化中心",
    descriptionEn: "Community center offering Chinese language classes, cultural events, and traditional art workshops for the Phoenix Chinese community.",
    descriptionZh: "为凤凰城华人社区提供中文课程、文化活动和传统艺术工作坊的社区中心。",
    categoryKey: "community",
    contact: {
      phone: "(602) 555-0101",
      email: "info@phxchinesecenter.org",
      website: "https://www.phxchinesecenter.org"
    },
    location: {
      addressLines: ["1234 N Central Ave", "Suite 200"],
      city: "Phoenix",
      state: "AZ",
      zip: "85004"
    },
    hours: [
      { dayOfWeek: 1, openTime: "09:00", closeTime: "21:00", is24h: false, isClosed: false },
      { dayOfWeek: 2, openTime: "09:00", closeTime: "21:00", is24h: false, isClosed: false },
      { dayOfWeek: 3, openTime: "09:00", closeTime: "21:00", is24h: false, isClosed: false },
      { dayOfWeek: 4, openTime: "09:00", closeTime: "21:00", is24h: false, isClosed: false },
      { dayOfWeek: 5, openTime: "09:00", closeTime: "21:00", is24h: false, isClosed: false },
      { dayOfWeek: 6, openTime: "10:00", closeTime: "18:00", is24h: false, isClosed: false },
      { dayOfWeek: 0, openTime: "", closeTime: "", is24h: false, isClosed: true }
    ]
  },
  {
    nameEn: "Golden Dragon Restaurant",
    nameZh: "金龙酒楼",
    descriptionEn: "Authentic Szechuan and Cantonese cuisine featuring traditional recipes passed down through generations. Specializing in dim sum and hot pot.",
    descriptionZh: "正宗川粤菜，秉承世代传承的传统配方。专营点心和火锅。",
    categoryKey: "restaurant",
    contact: {
      phone: "(480) 555-0102",
      email: "reservations@goldendragonaz.com",
      website: "https://www.goldendragonphx.com"
    },
    location: {
      addressLines: ["5678 E Camelback Rd"],
      city: "Phoenix",
      state: "AZ",
      zip: "85018"
    },
    hours: [
      { dayOfWeek: 1, openTime: "11:00", closeTime: "21:30", is24h: false, isClosed: false },
      { dayOfWeek: 2, openTime: "11:00", closeTime: "21:30", is24h: false, isClosed: false },
      { dayOfWeek: 3, openTime: "11:00", closeTime: "21:30", is24h: false, isClosed: false },
      { dayOfWeek: 4, openTime: "11:00", closeTime: "21:30", is24h: false, isClosed: false },
      { dayOfWeek: 5, openTime: "11:00", closeTime: "22:00", is24h: false, isClosed: false },
      { dayOfWeek: 6, openTime: "10:00", closeTime: "22:00", is24h: false, isClosed: false },
      { dayOfWeek: 0, openTime: "10:00", closeTime: "21:00", is24h: false, isClosed: false }
    ]
  },
  {
    nameEn: "Phoenix Chinese Market",
    nameZh: "凤凰城华人超市",
    descriptionEn: "Complete Asian grocery store featuring fresh produce, specialty ingredients, and imported goods from China, Taiwan, and Southeast Asia.",
    descriptionZh: "综合亚洲食品超市，提供新鲜农产品、特色食材和来自中国、台湾及东南亚的进口商品。",
    categoryKey: "retail",
    contact: {
      phone: "(623) 555-0103",
      email: "info@phxchinesemarket.com",
      website: "https://www.phxchinesemarket.com"
    },
    location: {
      addressLines: ["9012 W Thomas Rd"],
      city: "Phoenix",
      state: "AZ",
      zip: "85037"
    },
    hours: [
      { dayOfWeek: 1, openTime: "08:00", closeTime: "21:00", is24h: false, isClosed: false },
      { dayOfWeek: 2, openTime: "08:00", closeTime: "21:00", is24h: false, isClosed: false },
      { dayOfWeek: 3, openTime: "08:00", closeTime: "21:00", is24h: false, isClosed: false },
      { dayOfWeek: 4, openTime: "08:00", closeTime: "21:00", is24h: false, isClosed: false },
      { dayOfWeek: 5, openTime: "08:00", closeTime: "21:00", is24h: false, isClosed: false },
      { dayOfWeek: 6, openTime: "08:00", closeTime: "21:00", is24h: false, isClosed: false },
      { dayOfWeek: 0, openTime: "09:00", closeTime: "20:00", is24h: false, isClosed: false }
    ]
  },
  {
    nameEn: "Dr. Li Traditional Chinese Medicine",
    nameZh: "李医生中医诊所",
    descriptionEn: "Licensed acupuncturist and herbalist providing traditional Chinese medicine treatments including acupuncture, herbal remedies, and wellness consultations.",
    descriptionZh: "持证针灸师和中药师，提供传统中医治疗，包括针灸、草药治疗和健康咨询。",
    categoryKey: "healthcare",
    contact: {
      phone: "(480) 555-0104",
      email: "appointments@drlitcm.com",
      website: "https://www.drlitcm.com"
    },
    location: {
      addressLines: ["3456 E Indian School Rd", "Suite 150"],
      city: "Phoenix",
      state: "AZ",
      zip: "85018"
    },
    hours: [
      { dayOfWeek: 1, openTime: "09:00", closeTime: "18:00", is24h: false, isClosed: false },
      { dayOfWeek: 2, openTime: "09:00", closeTime: "18:00", is24h: false, isClosed: false },
      { dayOfWeek: 3, openTime: "09:00", closeTime: "18:00", is24h: false, isClosed: false },
      { dayOfWeek: 4, openTime: "09:00", closeTime: "18:00", is24h: false, isClosed: false },
      { dayOfWeek: 5, openTime: "09:00", closeTime: "17:00", is24h: false, isClosed: false },
      { dayOfWeek: 6, openTime: "09:00", closeTime: "15:00", is24h: false, isClosed: false },
      { dayOfWeek: 0, openTime: "", closeTime: "", is24h: false, isClosed: true }
    ]
  },
  {
    nameEn: "Jade Beauty Salon",
    nameZh: "翡翠美容院",
    descriptionEn: "Full-service beauty salon specializing in Asian hair styling, traditional Chinese beauty treatments, and modern skincare services.",
    descriptionZh: "全方位美容院，专营亚洲发型设计、传统中式美容护理和现代护肤服务。",
    categoryKey: "beauty",
    contact: {
      phone: "(602) 555-0105",
      email: "bookings@jadebeautysalon.com"
    },
    location: {
      addressLines: ["7890 N 7th St"],
      city: "Phoenix",
      state: "AZ",
      zip: "85020"
    },
    hours: [
      { dayOfWeek: 1, openTime: "10:00", closeTime: "19:00", is24h: false, isClosed: false },
      { dayOfWeek: 2, openTime: "10:00", closeTime: "19:00", is24h: false, isClosed: false },
      { dayOfWeek: 3, openTime: "10:00", closeTime: "19:00", is24h: false, isClosed: false },
      { dayOfWeek: 4, openTime: "10:00", closeTime: "19:00", is24h: false, isClosed: false },
      { dayOfWeek: 5, openTime: "10:00", closeTime: "20:00", is24h: false, isClosed: false },
      { dayOfWeek: 6, openTime: "09:00", closeTime: "18:00", is24h: false, isClosed: false },
      { dayOfWeek: 0, openTime: "11:00", closeTime: "17:00", is24h: false, isClosed: false }
    ]
  },
  {
    nameEn: "Phoenix Chinese School",
    nameZh: "凤凰城中文学校",
    descriptionEn: "Weekend Chinese language school offering Mandarin classes for children and adults, along with cultural education and traditional arts.",
    descriptionZh: "周末中文学校，为儿童和成人提供普通话课程，以及文化教育和传统艺术。",
    categoryKey: "education",
    contact: {
      phone: "(480) 555-0106",
      email: "info@phxchineseschool.org",
      website: "https://www.phxchineseschool.org"
    },
    location: {
      addressLines: ["2345 W Indian School Rd"],
      city: "Phoenix",
      state: "AZ",
      zip: "85015"
    },
    hours: [
      { dayOfWeek: 6, openTime: "09:00", closeTime: "15:00", is24h: false, isClosed: false },
      { dayOfWeek: 0, openTime: "09:00", closeTime: "15:00", is24h: false, isClosed: false },
      { dayOfWeek: 1, openTime: "", closeTime: "", is24h: false, isClosed: true },
      { dayOfWeek: 2, openTime: "", closeTime: "", is24h: false, isClosed: true },
      { dayOfWeek: 3, openTime: "", closeTime: "", is24h: false, isClosed: true },
      { dayOfWeek: 4, openTime: "", closeTime: "", is24h: false, isClosed: true },
      { dayOfWeek: 5, openTime: "", closeTime: "", is24h: false, isClosed: true }
    ]
  },
  {
    nameEn: "New Century Bookstore",
    nameZh: "新世纪书店",
    descriptionEn: "Bilingual bookstore featuring Chinese literature, language learning materials, children's books, and cultural gifts.",
    descriptionZh: "双语书店，提供中文文学、语言学习材料、儿童读物和文化礼品。",
    categoryKey: "retail",
    contact: {
      phone: "(623) 555-0107",
      email: "info@newcenturybookstore.com"
    },
    location: {
      addressLines: ["4567 W Glendale Ave"],
      city: "Glendale",
      state: "AZ",
      zip: "85301"
    },
    hours: [
      { dayOfWeek: 1, openTime: "10:00", closeTime: "20:00", is24h: false, isClosed: false },
      { dayOfWeek: 2, openTime: "10:00", closeTime: "20:00", is24h: false, isClosed: false },
      { dayOfWeek: 3, openTime: "10:00", closeTime: "20:00", is24h: false, isClosed: false },
      { dayOfWeek: 4, openTime: "10:00", closeTime: "20:00", is24h: false, isClosed: false },
      { dayOfWeek: 5, openTime: "10:00", closeTime: "21:00", is24h: false, isClosed: false },
      { dayOfWeek: 6, openTime: "10:00", closeTime: "21:00", is24h: false, isClosed: false },
      { dayOfWeek: 0, openTime: "11:00", closeTime: "19:00", is24h: false, isClosed: false }
    ]
  },
  {
    nameEn: "Ming's Tea House",
    nameZh: "明记茶楼",
    descriptionEn: "Traditional tea house serving premium Chinese teas, light snacks, and providing a peaceful environment for meetings and relaxation.",
    descriptionZh: "传统茶楼，供应优质中国茶、轻食小点，为聚会和放松提供宁静环境。",
    categoryKey: "restaurant",
    contact: {
      phone: "(480) 555-0108",
      email: "info@mingsteahouse.com"
    },
    location: {
      addressLines: ["6789 E McDowell Rd"],
      city: "Scottsdale",
      state: "AZ",
      zip: "85257"
    },
    hours: [
      { dayOfWeek: 1, openTime: "10:00", closeTime: "22:00", is24h: false, isClosed: false },
      { dayOfWeek: 2, openTime: "10:00", closeTime: "22:00", is24h: false, isClosed: false },
      { dayOfWeek: 3, openTime: "10:00", closeTime: "22:00", is24h: false, isClosed: false },
      { dayOfWeek: 4, openTime: "10:00", closeTime: "22:00", is24h: false, isClosed: false },
      { dayOfWeek: 5, openTime: "10:00", closeTime: "23:00", is24h: false, isClosed: false },
      { dayOfWeek: 6, openTime: "09:00", closeTime: "23:00", is24h: false, isClosed: false },
      { dayOfWeek: 0, openTime: "09:00", closeTime: "22:00", is24h: false, isClosed: false }
    ]
  },
  {
    nameEn: "Phoenix Immigration Law Office",
    nameZh: "凤凰城移民律师事务所",
    descriptionEn: "Experienced immigration law firm providing comprehensive legal services for visa applications, green cards, and citizenship matters.",
    descriptionZh: "经验丰富的移民律师事务所，为签证申请、绿卡和入籍事宜提供全面的法律服务。",
    categoryKey: "services",
    contact: {
      phone: "(602) 555-0109",
      email: "consultation@phximmigrationlaw.com",
      website: "https://www.phximmigrationlaw.com"
    },
    location: {
      addressLines: ["8901 N Central Ave", "Suite 400"],
      city: "Phoenix",
      state: "AZ",
      zip: "85020"
    },
    hours: [
      { dayOfWeek: 1, openTime: "09:00", closeTime: "17:00", is24h: false, isClosed: false },
      { dayOfWeek: 2, openTime: "09:00", closeTime: "17:00", is24h: false, isClosed: false },
      { dayOfWeek: 3, openTime: "09:00", closeTime: "17:00", is24h: false, isClosed: false },
      { dayOfWeek: 4, openTime: "09:00", closeTime: "17:00", is24h: false, isClosed: false },
      { dayOfWeek: 5, openTime: "09:00", closeTime: "16:00", is24h: false, isClosed: false },
      { dayOfWeek: 6, openTime: "", closeTime: "", is24h: false, isClosed: true },
      { dayOfWeek: 0, openTime: "", closeTime: "", is24h: false, isClosed: true }
    ]
  },
  {
    nameEn: "Happy Family Childcare",
    nameZh: "快乐家庭托儿所",
    descriptionEn: "Licensed bilingual daycare center providing quality childcare with Mandarin immersion programs for children ages 6 months to 5 years.",
    descriptionZh: "持牌双语日托中心，为6个月至5岁儿童提供优质托儿服务和中文沉浸式课程。",
    categoryKey: "childcare",
    contact: {
      phone: "(480) 555-0110",
      email: "enrollment@happyfamilychildcare.com"
    },
    location: {
      addressLines: ["1357 E Baseline Rd"],
      city: "Tempe",
      state: "AZ",
      zip: "85283"
    },
    hours: [
      { dayOfWeek: 1, openTime: "06:30", closeTime: "18:00", is24h: false, isClosed: false },
      { dayOfWeek: 2, openTime: "06:30", closeTime: "18:00", is24h: false, isClosed: false },
      { dayOfWeek: 3, openTime: "06:30", closeTime: "18:00", is24h: false, isClosed: false },
      { dayOfWeek: 4, openTime: "06:30", closeTime: "18:00", is24h: false, isClosed: false },
      { dayOfWeek: 5, openTime: "06:30", closeTime: "18:00", is24h: false, isClosed: false },
      { dayOfWeek: 6, openTime: "", closeTime: "", is24h: false, isClosed: true },
      { dayOfWeek: 0, openTime: "", closeTime: "", is24h: false, isClosed: true }
    ]
  }
];

async function seedSampleBusinesses() {
  console.log('🌱 Starting to seed sample businesses...');

  try {
    // First, ensure we have the required categories
    const categories = await prisma.category.findMany();
    const categoryMap = new Map(categories.map(cat => [cat.key, cat.id]));
    
    let created = 0;
    let skipped = 0;

    for (const business of sampleBusinesses) {
      try {
        // Check if business already exists
        const existingBusiness = await prisma.business.findFirst({
          where: {
            localized: {
              some: {
                name: business.nameEn
              }
            }
          }
        });

        if (existingBusiness) {
          console.log(`⏭️  Skipping "${business.nameEn}" - already exists`);
          skipped++;
          continue;
        }

        // Get category ID
        const categoryId = categoryMap.get(business.categoryKey);
        if (!categoryId) {
          console.log(`⚠️  Skipping "${business.nameEn}" - category "${business.categoryKey}" not found`);
          skipped++;
          continue;
        }

        // Generate slug
        const slug = business.nameEn
          .toLowerCase()
          .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
          .replace(/^-+|-+$/g, '');

        // Create the business
        const createdBusiness = await prisma.business.create({
          data: {
            slug,
            status: 'APPROVED', // Approve sample businesses by default
            localized: {
              create: [
                {
                  lang: 'en',
                  name: business.nameEn,
                  description: business.descriptionEn,
                  slugLocalized: slug
                },
                {
                  lang: 'zh',
                  name: business.nameZh,
                  description: business.descriptionZh,
                  slugLocalized: slug + '-zh'
                }
              ]
            },
            contact: {
              create: business.contact
            },
            location: {
              create: business.location
            },
            hours: {
              create: business.hours
            },
            categories: {
              create: [
                { categoryId }
              ]
            }
          },
          include: {
            localized: true,
            contact: true,
            location: true,
            hours: true,
            categories: {
              include: {
                category: true
              }
            }
          }
        });

        console.log(`✅ Created "${business.nameEn}" (${business.nameZh})`);
        created++;

      } catch (error) {
        console.error(`❌ Failed to create "${business.nameEn}":`, error.message);
        skipped++;
      }
    }

    console.log(`\n🎉 Seeding completed!`);
    console.log(`✅ Created: ${created} businesses`);
    console.log(`⏭️  Skipped: ${skipped} businesses`);
    
    if (created > 0) {
      console.log(`\n💡 You can now view the businesses at:`);
      console.log(`   • http://localhost:3000/en/businesses`);
      console.log(`   • http://localhost:3000/zh/businesses`);
    }

  } catch (error) {
    console.error('❌ Error seeding sample businesses:', error);
    throw error;
  }
}

// Run the seed function
seedSampleBusinesses()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });