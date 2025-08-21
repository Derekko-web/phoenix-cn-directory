'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { CategoryIcon } from './icons/CategoryIcons';

interface Category {
  key: string;
  href: string;
  gradient: string;
  size: 'small' | 'medium' | 'large';
  character: string;
}

const categories: Category[] = [
  { 
    key: 'eatDrink', 
    href: '/businesses?category=eat-drink', 
    gradient: 'from-chinese-red-500 to-chinese-gold-500',
    size: 'large',
    character: '食'
  },
  { 
    key: 'groceries', 
    href: '/businesses?category=groceries', 
    gradient: 'from-chinese-gold-500 to-chinese-jade-500',
    size: 'medium',
    character: '购'
  },
  { 
    key: 'services', 
    href: '/businesses?category=services', 
    gradient: 'from-chinese-jade-500 to-chinese-red-500',
    size: 'medium',
    character: '务'
  },
  { 
    key: 'health', 
    href: '/businesses?category=health', 
    gradient: 'from-chinese-red-400 to-chinese-jade-400',
    size: 'small',
    character: '医'
  },
  { 
    key: 'education', 
    href: '/businesses?category=education', 
    gradient: 'from-chinese-gold-400 to-chinese-red-400',
    size: 'small',
    character: '学'
  },
  { 
    key: 'community', 
    href: '/businesses?category=community', 
    gradient: 'from-chinese-jade-400 to-chinese-gold-400',
    size: 'large',
    character: '群'
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15
    }
  }
};

const CategoryCard = ({ category, index, locale }: { category: Category; index: number; locale: 'en' | 'zh' }) => {
  const tCategories = useTranslations('categories');
  
  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'large':
        return 'col-span-2 row-span-2 min-h-[280px]';
      case 'medium':
        return 'col-span-1 row-span-2 min-h-[280px]';
      case 'small':
        return 'col-span-1 row-span-1 min-h-[130px]';
      default:
        return 'col-span-1 row-span-1 min-h-[130px]';
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ 
        scale: 1.03, 
        transition: { duration: 0.2 } 
      }}
      whileTap={{ scale: 0.98 }}
      className={`${getSizeClasses(category.size)} category-card`}
    >
      <Link href={`/${locale}${category.href}` as any} className="block h-full group">
        <div className="relative h-full rounded-3xl overflow-hidden hover-glow">
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-90 group-hover:opacity-100 transition-opacity duration-300`} />
          
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300"
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.3' fill-rule='evenodd'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
               }} 
          />
          
          {/* Content */}
          <div className="relative h-full flex flex-col justify-between p-6 text-white">
            <div className="flex items-start justify-between">
              <div className={`text-white/90 ${category.size === 'large' ? 'text-6xl' : category.size === 'medium' ? 'text-4xl' : 'text-3xl'} font-chinese font-bold group-hover:scale-110 transition-transform duration-300`}>
                {category.character}
              </div>
              <motion.div 
                className="opacity-60 group-hover:opacity-100"
                whileHover={{ rotate: 15 }}
                transition={{ duration: 0.2 }}
              >
                <CategoryIcon 
                  category={category.key} 
                  size={category.size === 'large' ? 32 : 24} 
                  className="text-white drop-shadow-lg" 
                />
              </motion.div>
            </div>
            
            <div className="space-y-2">
              <h3 className={`font-bold text-white drop-shadow-lg ${category.size === 'large' ? 'text-2xl' : 'text-lg'}`}>
                {tCategories(category.key as any)}
              </h3>
              
              {category.size === 'large' && (
                <p className="text-white/80 text-sm font-medium">
                  {category.key === 'eatDrink' && '探索正宗中式美食'}
                  {category.key === 'community' && '连接华人社区文化'}
                </p>
              )}
            </div>

            {/* Floating elements */}
            <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 2 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3
                  }}
                  style={{
                    left: `${i * 8}px`,
                    top: `${i * 8}px`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export const CategoryGrid = () => {
  const locale = useLocale() as 'en' | 'zh';
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold font-chinese mb-6">
            <span className="bg-gradient-to-r from-chinese-red-600 to-chinese-gold-600 bg-clip-text text-transparent">
              发现分类
            </span>
          </h2>
          <p className="text-xl text-chinese-ink-600 max-w-2xl mx-auto font-chinese">
            从美食到服务，从健康到教育，一站式华人生活指南
          </p>
        </motion.div>

        {/* Bento grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-max"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {categories.map((category, index) => (
            <CategoryCard key={category.key} category={category} index={index} locale={locale} />
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-chinese-ink-500 font-chinese">
            更多分类和服务，敬请期待... ✨
          </p>
        </motion.div>
      </div>
    </section>
  );
};