'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { CategoryGrid } from '@/components/CategoryGrid';

export default function CategoriesPage() {
  const t = useTranslations();
  const currentLocale = useLocale();

  return (
    <main className="min-h-screen pt-20 sm:pt-24 pb-16 particle-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Enhanced Header Section */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 font-chinese text-shimmer"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {currentLocale === 'zh' ? '商家分类' : 'Business Categories'}
          </motion.h1>
          <motion.p 
            className="text-lg sm:text-xl text-chinese-ink-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {currentLocale === 'zh' 
              ? '浏览凤凰城华人社区的各类商家和服务' 
              : 'Browse all types of businesses and services in the Phoenix Chinese community'
            }
          </motion.p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <CategoryGrid />
        </motion.div>

        {/* Enhanced Call to Action */}
        <motion.div
          className="text-center mt-12 sm:mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link href={`/${currentLocale}/submit-business` as any}>
            <motion.div
              className="btn-magnetic neon-border inline-flex items-center gap-3 bg-gradient-to-r from-chinese-red-500 to-chinese-gold-500 text-white px-6 sm:px-8 py-4 rounded-xl font-medium text-lg shadow-2xl hover:shadow-chinese-gold transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>
                {currentLocale === 'zh' ? '添加您的商家' : 'Add Your Business'}
              </span>
              <motion.svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.3 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </motion.svg>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}