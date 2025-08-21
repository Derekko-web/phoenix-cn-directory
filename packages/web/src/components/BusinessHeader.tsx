'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { MapPinIcon, StarIcon, ShareIcon } from '@heroicons/react/24/outline';
import { type Business, type BusinessLocalized } from '@/lib/api';

interface BusinessHeaderProps {
  business: Business;
  localized: BusinessLocalized;
  locale: 'en' | 'zh';
}

export function BusinessHeader({ business, localized, locale }: BusinessHeaderProps) {
  const primaryPhoto = business.photos?.[0];
  const averageRating = business.reviews && business.reviews.length > 0
    ? business.reviews.reduce((sum, review) => sum + review.rating, 0) / business.reviews.length
    : 0;

  return (
    <section className="relative">
      {/* Hero Background */}
      <div className="h-80 bg-gradient-to-r from-chinese-red-600 to-chinese-gold-600 relative overflow-hidden">
        {primaryPhoto && (
          <div className="absolute inset-0">
            <Image
              src={primaryPhoto.url}
              alt={primaryPhoto.caption || localized.name}
              fill
              className="object-cover opacity-30"
              priority
            />
          </div>
        )}
        
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative h-full flex items-end">
          <div className="max-w-7xl mx-auto px-6 pb-8 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-chinese">
                {localized.name}
              </h1>
              
              {averageRating > 0 && (
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(averageRating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-white/50'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-3 text-white text-lg">
                    {averageRating.toFixed(1)} ({business.reviews?.length || 0} reviews)
                  </span>
                </div>
              )}
              
              {business.location && (
                <div className="flex items-center text-white/90 text-lg">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  <span>
                    {business.location.city}, {business.location.state}
                  </span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Actions Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Navigation will go here */}
            </div>
            
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: localized.name,
                    text: localized.description || '',
                    url: window.location.href,
                  });
                }
              }}
              className="flex items-center px-4 py-2 bg-chinese-red-600 text-white rounded-lg hover:bg-chinese-red-700 transition-colors"
            >
              <ShareIcon className="h-4 w-4 mr-2" />
              Share
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}