'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { MapPinIcon, ClockIcon, StarIcon, PhoneIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { type Business } from '@/lib/api';

interface BusinessListItemProps {
  business: Business;
  locale: 'en' | 'zh';
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

export function BusinessListItem({ business, locale }: BusinessListItemProps) {
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
      variants={itemVariants}
      whileHover={{ scale: 1.01 }}
      className="group"
    >
      <Link 
        href={`/${locale}/business/${business.slug}`}
        className="block bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-chinese-red-200"
      >
        <div className="flex flex-col sm:flex-row">
          {/* Business Photo */}
          <div className="relative w-full sm:w-48 h-48 sm:h-40 bg-gray-100 overflow-hidden flex-shrink-0">
            {primaryPhoto ? (
              <Image
                src={primaryPhoto.url}
                alt={primaryPhoto.caption || localizedContent?.name || ''}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, 192px"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-chinese-red-50 via-chinese-gold-50 to-chinese-red-100 flex items-center justify-center">
                <div className="text-4xl opacity-60">
                  {primaryCategory?.icon || '🏪'}
                </div>
              </div>
            )}
            
            {/* Open/Closed Status Badge */}
            <div className="absolute top-3 left-3">
              {openNow ? (
                <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                  <div className="w-2 h-2 bg-green-200 rounded-full mr-1.5 animate-pulse"></div>
                  {t('openNow')}
                </div>
              ) : todayHours ? (
                <div className="bg-gray-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                  {t('closed')}
                </div>
              ) : null}
            </div>

            {/* Category Badge */}
            {primaryCategory && (
              <div className="absolute top-3 right-3 bg-chinese-red-600/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                {locale === 'zh' ? primaryCategory.nameZh : primaryCategory.nameEn}
              </div>
            )}
          </div>

          {/* Business Info */}
          <div className="flex-1 p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              {/* Main Info */}
              <div className="flex-1 min-w-0">
                {/* Business Name & Rating */}
                <div className="mb-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-chinese-red-600 transition-colors line-clamp-2 mb-2">
                    {localizedContent?.name || 'Unnamed Business'}
                  </h3>
                  
                  {/* Rating */}
                  {averageRating > 0 && (
                    <div className="flex items-center">
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
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {averageRating.toFixed(1)}
                      </span>
                      <span className="ml-1 text-sm text-gray-500">
                        ({business.reviews?.length || 0})
                      </span>
                    </div>
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
                      <span className="text-sm text-gray-600 ml-2">
                        {business.location.addressLines.join(', ')}, {business.location.city}, {business.location.state}
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

                  {/* Website */}
                  {business.contact?.website && (
                    <div className="flex items-center">
                      <GlobeAltIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-chinese-red-600 hover:text-chinese-red-700 ml-2 truncate">
                        {business.contact.website.replace(/^https?:\/\//, '')}
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
              </div>

              {/* Action Area */}
              <div className="flex-shrink-0">
                <div className="text-chinese-red-600 text-sm font-medium group-hover:text-chinese-red-700 flex items-center">
                  {t('viewDetails')}
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                
                {/* Photo count */}
                {business.photos && business.photos.length > 1 && (
                  <div className="mt-2 text-xs text-gray-500 flex items-center">
                    📷 {business.photos.length} {business.photos.length === 1 ? 'photo' : 'photos'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}