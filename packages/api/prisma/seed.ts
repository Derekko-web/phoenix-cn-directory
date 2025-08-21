import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  {
    key: 'eat-drink',
    nameEn: 'Eat & Drink',
    nameZh: '餐饮',
    icon: '🍽️',
    children: [
      { key: 'chinese-restaurant', nameEn: 'Chinese Restaurants', nameZh: '中餐厅' },
      { key: 'sichuan', nameEn: 'Sichuan Cuisine', nameZh: '川菜' },
      { key: 'cantonese', nameEn: 'Cantonese Cuisine', nameZh: '粤菜' },
      { key: 'bubble-tea', nameEn: 'Bubble Tea', nameZh: '奶茶' },
      { key: 'hotpot', nameEn: 'Hot Pot', nameZh: '火锅' },
      { key: 'dim-sum', nameEn: 'Dim Sum', nameZh: '点心' },
    ]
  },
  {
    key: 'groceries',
    nameEn: 'Groceries & Specialty',
    nameZh: '食品杂货',
    icon: '🛒',
    children: [
      { key: 'asian-market', nameEn: 'Asian Markets', nameZh: '亚洲超市' },
      { key: 'chinese-grocery', nameEn: 'Chinese Grocery', nameZh: '中式食品' },
      { key: 'seafood', nameEn: 'Seafood', nameZh: '海鲜' },
      { key: 'butcher', nameEn: 'Butcher', nameZh: '肉类' },
    ]
  },
  {
    key: 'services',
    nameEn: 'Services',
    nameZh: '服务',
    icon: '🔧',
    children: [
      { key: 'immigration', nameEn: 'Immigration Law', nameZh: '移民律师' },
      { key: 'tax-service', nameEn: 'Tax Services', nameZh: '税务服务' },
      { key: 'real-estate', nameEn: 'Real Estate', nameZh: '房地产' },
      { key: 'insurance', nameEn: 'Insurance', nameZh: '保险' },
      { key: 'auto-repair', nameEn: 'Auto Repair', nameZh: '汽车维修' },
      { key: 'salon', nameEn: 'Hair & Beauty', nameZh: '美发美容' },
    ]
  },
  {
    key: 'health',
    nameEn: 'Health & Wellness',
    nameZh: '健康保健',
    icon: '🏥',
    children: [
      { key: 'tcm', nameEn: 'Traditional Chinese Medicine', nameZh: '中医' },
      { key: 'acupuncture', nameEn: 'Acupuncture', nameZh: '针灸' },
      { key: 'family-doctor', nameEn: 'Family Medicine', nameZh: '家庭医生' },
      { key: 'dentist', nameEn: 'Dentist', nameZh: '牙医' },
      { key: 'optometrist', nameEn: 'Eye Care', nameZh: '眼科' },
    ]
  },
  {
    key: 'education',
    nameEn: 'Education',
    nameZh: '教育',
    icon: '🎓',
    children: [
      { key: 'chinese-school', nameEn: 'Chinese Language School', nameZh: '中文学校' },
      { key: 'tutoring', nameEn: 'Tutoring', nameZh: '辅导' },
      { key: 'test-prep', nameEn: 'Test Preparation', nameZh: '考试准备' },
      { key: 'music-school', nameEn: 'Music & Dance', nameZh: '音乐舞蹈' },
    ]
  },
  {
    key: 'community',
    nameEn: 'Community & Culture',
    nameZh: '社区文化',
    icon: '🏛️',
    children: [
      { key: 'association', nameEn: 'Chinese Associations', nameZh: '华人协会' },
      { key: 'temple', nameEn: 'Temples', nameZh: '寺庙' },
      { key: 'church', nameEn: 'Churches', nameZh: '教会' },
      { key: 'cultural-center', nameEn: 'Cultural Centers', nameZh: '文化中心' },
    ]
  }
];

async function main() {
  console.log('🌱 Seeding database...');

  for (const category of categories) {
    const parent = await prisma.category.upsert({
      where: { key: category.key },
      update: {},
      create: {
        key: category.key,
        nameEn: category.nameEn,
        nameZh: category.nameZh,
        icon: category.icon,
      },
    });

    if (category.children) {
      for (const child of category.children) {
        await prisma.category.upsert({
          where: { key: child.key },
          update: {},
          create: {
            key: child.key,
            nameEn: child.nameEn,
            nameZh: child.nameZh,
            parentId: parent.id,
          },
        });
      }
    }
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });