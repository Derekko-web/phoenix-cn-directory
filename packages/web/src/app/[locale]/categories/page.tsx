'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { CategoryGrid } from '@/components/CategoryGrid';

export default function CategoriesPage() {
  const t = useTranslations();
  const currentLocale = useLocale();

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-chinese">
            <span className="bg-gradient-to-r from-chinese-red-600 via-chinese-gold-600 to-chinese-jade-600 bg-clip-text text-transparent">
              {currentLocale === 'zh' ? '商家分类' : 'Business Categories'}
            </span>
          </h1>
          <p className="text-xl text-chinese-ink-600 max-w-3xl mx-auto leading-relaxed">
            {currentLocale === 'zh' 
              ? '浏览凤凰城华人社区的各类商家和服务' 
              : 'Browse all types of businesses and services in the Phoenix Chinese community'
            }
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <CategoryGrid />
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link href={`/${currentLocale}/submit-business` as any}>
            <motion.div
              className="inline-flex items-center gap-3 bg-gradient-to-r from-chinese-red-500 to-chinese-gold-500 text-white px-8 py-4 rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>
                {currentLocale === 'zh' ? '添加您的商家' : 'Add Your Business'}
              </span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}