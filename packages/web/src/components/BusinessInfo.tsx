'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { InformationCircleIcon, TagIcon, ClockIcon } from '@heroicons/react/24/outline';
import { type Business, type BusinessLocalized } from '@/lib/api';

interface BusinessInfoProps {
  business: Business;
  localized: BusinessLocalized;
  locale: 'en' | 'zh';
}

export function BusinessInfo({ business, localized, locale }: BusinessInfoProps) {
  const t = useTranslations('business');
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const shouldTruncate = localized.description && localized.description.length > 300;
  const displayDescription = shouldTruncate && !isExpanded 
    ? localized.description?.slice(0, 300) + '...'
    : localized.description;

  return (
    <motion.div 
      className="bento-card bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-500 will-change-transform"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -4 }}
    >
      {/* Header with Icon */}
      <motion.div 
        className="flex items-center mb-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="p-3 bg-gradient-to-br from-chinese-red-500 to-chinese-gold-500 rounded-xl mr-4 shadow-lg">
          <InformationCircleIcon className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-chinese-ink-800 to-chinese-ink-600 bg-clip-text text-transparent font-chinese">
          {locale === 'zh' ? `关于 ${localized.name}` : `About ${localized.name}`}
        </h2>
      </motion.div>
      
      {/* Description with Enhanced Typography */}
      {localized.description && (
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="relative">
            <div className="prose prose-lg max-w-none text-chinese-ink-700 leading-relaxed">
              <motion.p 
                className="text-lg leading-relaxed"
                layout
                transition={{ duration: 0.3 }}
              >
                {displayDescription}
              </motion.p>
            </div>
            
            {shouldTruncate && (
              <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-4 inline-flex items-center text-chinese-red-600 hover:text-chinese-red-700 font-medium transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{isExpanded ? (locale === 'zh' ? '收起' : 'Show less') : (locale === 'zh' ? '展开' : 'Read more')}</span>
                <motion.svg 
                  className="ml-2 h-4 w-4"
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
      
      {/* Enhanced Categories Section */}
      {business.categories && business.categories.length > 0 && (
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center mb-4">
            <div className="p-2 bg-gradient-to-br from-chinese-gold-400 to-chinese-gold-500 rounded-lg mr-3 shadow-md">
              <TagIcon className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-chinese-ink-800">
              {locale === 'zh' ? '分类' : 'Categories'}
            </h3>
          </div>
          
          <motion.div 
            className="flex flex-wrap gap-3"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            initial="hidden"
            animate="visible"
          >
            {business.categories.map(({ category }, index) => (
              <motion.button
                key={category.id}
                className="group relative inline-flex items-center px-4 py-3 bg-gradient-to-r from-chinese-red-50 to-chinese-red-100 hover:from-chinese-red-100 hover:to-chinese-red-200 text-chinese-red-800 font-medium rounded-xl border border-chinese-red-200/50 transition-all duration-300 overflow-hidden"
                variants={{
                  hidden: { opacity: 0, scale: 0.8, y: 20 },
                  visible: { opacity: 1, scale: 1, y: 0 }
                }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  boxShadow: "0 10px 25px rgba(220, 38, 38, 0.15)" 
                }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setHoveredCategory(category.id)}
                onHoverEnd={() => setHoveredCategory(null)}
              >
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-chinese-red-200/50 to-chinese-gold-200/50"
                  initial={{ x: '-100%' }}
                  animate={{ 
                    x: hoveredCategory === category.id ? '0%' : '-100%' 
                  }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Content */}
                <div className="relative flex items-center space-x-2">
                  {category.icon && (
                    <motion.span 
                      className="text-lg"
                      animate={{ 
                        rotate: hoveredCategory === category.id ? [0, -10, 10, 0] : 0 
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      {category.icon}
                    </motion.span>
                  )}
                  <span className="font-medium">
                    {locale === 'zh' ? category.nameZh : category.nameEn}
                  </span>
                </div>

                {/* Hover effect particles */}
                <motion.div
                  className="absolute top-1 right-1 w-1 h-1 bg-chinese-gold-400 rounded-full"
                  animate={{
                    scale: hoveredCategory === category.id ? [0, 1.5, 0] : 0,
                    opacity: hoveredCategory === category.id ? [0, 1, 0] : 0
                  }}
                  transition={{ duration: 0.6, repeat: hoveredCategory === category.id ? Infinity : 0 }}
                />
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* Additional Info Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        {/* Business Type Card */}
        <div className="bg-gradient-to-br from-chinese-jade-50 to-chinese-jade-100/50 rounded-xl p-4 border border-chinese-jade-200/30">
          <div className="flex items-center">
            <div className="p-2 bg-chinese-jade-500 rounded-lg mr-3">
              <InformationCircleIcon className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm text-chinese-jade-600 font-medium">
                {locale === 'zh' ? '商家类型' : 'Business Type'}
              </div>
              <div className="text-chinese-jade-800 font-semibold">
                {business.categories?.[0] ? 
                  (locale === 'zh' ? business.categories[0].category.nameZh : business.categories[0].category.nameEn) :
                  (locale === 'zh' ? '商家' : 'Business')
                }
              </div>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-gradient-to-br from-chinese-gold-50 to-chinese-gold-100/50 rounded-xl p-4 border border-chinese-gold-200/30">
          <div className="flex items-center">
            <div className="p-2 bg-chinese-gold-500 rounded-lg mr-3">
              <ClockIcon className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm text-chinese-gold-600 font-medium">
                {locale === 'zh' ? '营业状态' : 'Status'}
              </div>
              <div className="text-chinese-gold-800 font-semibold">
                {locale === 'zh' ? '营业中' : 'Open'}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}