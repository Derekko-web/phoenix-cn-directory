'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { MapPinIcon, ClockIcon, StarIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { type Business } from '@/lib/api';

interface BusinessCardProps {
  business: Business;
  locale: 'en' | 'zh';
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
      duration: 0.6
    }
  },
  hover: { 
    y: -8,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

export function BusinessCard({ business, locale }: BusinessCardProps) {
  const t = useTranslations('business');
  
  // Get localized content
  const localizedContent = business.localized.find(l => l.lang === locale) || business.localized[0];
  const primaryPhoto = business.photos?.[0];
  
  // Get business hours for today
  const today = new Date().getDay(); // 0 = Sunday
  const todayHours = business.hours?.find(h => h.dayOfWeek === today);
  
  // Calculate average rating
  const averageRating = business.reviews && business.reviews.length > 0
    ? business.reviews.reduce((sum, review) => sum + review.rating, 0) / business.reviews.length
    : 0;

  // Get primary category
  const primaryCategory = business.categories?.[0]?.category;

  // Check if business is currently open
  const isOpenNow = () => {
    if (!todayHours) return false;
    if (todayHours.is24h) return true;
    if (!todayHours.openTime || !todayHours.closeTime) return false;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [openHour, openMin] = todayHours.openTime.split(':').map(Number);
    const [closeHour, closeMin] = todayHours.closeTime.split(':').map(Number);
    const openTime = openHour * 60 + openMin;
    const closeTime = closeHour * 60 + closeMin;
    
    return currentTime >= openTime && currentTime <= closeTime;
  };

  const openNow = isOpenNow();

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      className="group"
    >
      <Link 
        href={`/${locale}/business/${business.slug}`}
        className="block bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden business-card border border-gray-100 hover:border-chinese-red-200"
      >
        {/* Business Photo */}
        <div className="relative h-52 bg-gray-100 overflow-hidden">
          {primaryPhoto ? (
            <Image
              src={primaryPhoto.url}
              alt={primaryPhoto.caption || localizedContent?.name || ''}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-chinese-red-50 via-chinese-gold-50 to-chinese-red-100 flex items-center justify-center">
              <div className="text-5xl opacity-60">
                {primaryCategory?.icon || '🏪'}
              </div>
            </div>
          )}
          
          {/* Open/Closed Status Badge */}
          <motion.div 
            className="absolute top-3 left-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            {openNow ? (
              <motion.div 
                className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div 
                  className="w-2 h-2 bg-green-200 rounded-full mr-2"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                ></motion.div>
                {t('openNow')}
              </motion.div>
            ) : todayHours ? (
              <motion.div 
                className="bg-gray-600 text-white px-3 py-1 rounded-full text-xs font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('closed')}
              </motion.div>
            ) : null}
          </motion.div>

          {/* Category Badge */}
          {primaryCategory && (
            <div className="absolute top-3 right-3 bg-chinese-red-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
              {locale === 'zh' ? primaryCategory.nameZh : primaryCategory.nameEn}
            </div>
          )}

          {/* Photo Count Badge */}
          {business.photos && business.photos.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-medium flex items-center">
              📷 {business.photos.length}
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Business Info */}
        <div className="p-6">
          {/* Business Name & Rating Row */}
          <div className="mb-3">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-chinese-red-600 transition-colors line-clamp-2 mb-2">
              {localizedContent?.name || 'Unnamed Business'}
            </h3>
            
            {/* Rating */}
            {averageRating > 0 && (
              <motion.div 
                className="flex items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + (i * 0.1), duration: 0.3 }}
                      whileHover={{ scale: 1.2 }}
                    >
                      <StarIcon
                        className={`h-4 w-4 ${
                          i < Math.floor(averageRating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </motion.div>
                  ))}
                </div>
                <motion.span 
                  className="ml-2 text-sm font-medium text-gray-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.3 }}
                >
                  {averageRating.toFixed(1)}
                </motion.span>
                <motion.span 
                  className="ml-1 text-sm text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.3 }}
                >
                  ({business.reviews?.length || 0})
                </motion.span>
              </motion.div>
            )}
          </div>

          {/* Description */}
          {localizedContent?.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
              {localizedContent.description}
            </p>
          )}

          {/* Business Details */}
          <div className="space-y-2">
            {/* Location */}
            {business.location && (
              <div className="flex items-start">
                <MapPinIcon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-600 ml-2 line-clamp-2">
                  {business.location.addressLines.join(', ')}, {business.location.city}
                </span>
              </div>
            )}

            {/* Phone */}
            {business.contact?.phone && (
              <div className="flex items-center">
                <PhoneIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-600 ml-2">
                  {business.contact.phone}
                </span>
              </div>
            )}

            {/* Business Hours */}
            {todayHours && (
              <div className="flex items-center">
                <ClockIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className={`text-sm ml-2 font-medium ${
                  openNow ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {todayHours.is24h ? (
                    t('open24h')
                  ) : todayHours.openTime && todayHours.closeTime ? (
                    `${t('today')}: ${todayHours.openTime} - ${todayHours.closeTime}`
                  ) : (
                    t('closed')
                  )}
                </span>
              </div>
            )}
          </div>

          {/* View Details Button */}
          <motion.div 
            className="mt-4 pt-3 border-t border-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <motion.div 
              className="text-chinese-red-600 text-sm font-medium group-hover:text-chinese-red-700 flex items-center justify-between"
              whileHover={{ scale: 1.02 }}
            >
              {t('viewDetails')}
              <motion.svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </motion.svg>
            </motion.div>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}