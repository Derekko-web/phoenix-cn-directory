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

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ 
        scale: 1.02, 
        transition: { duration: 0.2 } 
      }}
      className="group"
    >
      <Link 
        href={`/${locale}/business/${business.slug}`}
        className="block bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden business-card"
      >
        {/* Business Photo */}
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          {primaryPhoto ? (
            <Image
              src={primaryPhoto.url}
              alt={primaryPhoto.caption || localizedContent?.name || ''}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-chinese-red-100 to-chinese-gold-100 flex items-center justify-center">
              <div className="text-4xl text-chinese-red-400">
                {primaryCategory?.icon || '🏪'}
              </div>
            </div>
          )}
          
          {/* Category Badge */}
          {primaryCategory && (
            <div className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
              {locale === 'zh' ? primaryCategory.nameZh : primaryCategory.nameEn}
            </div>
          )}
        </div>

        {/* Business Info */}
        <div className="p-6">
          {/* Business Name */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-chinese-red-600 transition-colors line-clamp-2">
            {localizedContent?.name || 'Unnamed Business'}
          </h3>

          {/* Rating */}
          {averageRating > 0 && (
            <div className="flex items-center mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(averageRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {averageRating.toFixed(1)} ({business.reviews?.length || 0})
              </span>
            </div>
          )}

          {/* Description */}
          {localizedContent?.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {localizedContent.description}
            </p>
          )}

          {/* Location */}
          {business.location && (
            <div className="flex items-start mb-3">
              <MapPinIcon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-600 ml-2">
                {business.location.addressLines.join(', ')}, {business.location.city}, {business.location.state}
              </span>
            </div>
          )}

          {/* Phone */}
          {business.contact?.phone && (
            <div className="flex items-center mb-3">
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
              <span className="text-sm text-gray-600 ml-2">
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
      </Link>
    </motion.div>
  );
}