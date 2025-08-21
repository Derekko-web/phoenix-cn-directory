'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { MapPinIcon, StarIcon, ShareIcon, HeartIcon, EyeIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { type Business, type BusinessLocalized } from '@/lib/api';

interface BusinessHeaderProps {
  business: Business;
  localized: BusinessLocalized;
  locale: 'en' | 'zh';
}

export function BusinessHeader({ business, localized, locale }: BusinessHeaderProps) {
  const primaryPhoto = business.photos?.[0];
  const [isLiked, setIsLiked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  
  const averageRating = business.reviews && business.reviews.length > 0
    ? business.reviews.reduce((sum, review) => sum + review.rating, 0) / business.reviews.length
    : 0;

  useEffect(() => {
    setViewCount(Math.floor(Math.random() * 1000) + 100);
  }, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: localized.name,
        text: localized.description || '',
        url: window.location.href,
      });
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  return (
    <section className="relative overflow-hidden">
      {/* Enhanced Hero Background with Parallax Effect */}
      <motion.div 
        className="h-[32rem] relative"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        {/* Gradient Mesh Background */}
        <div className="absolute inset-0 gradient-mesh" />
        
        {/* Dynamic Gradient Overlay removed */}
        
        {primaryPhoto && (
          <motion.div 
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 0.4, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <Image
              src={primaryPhoto.url}
              alt={primaryPhoto.caption || localized.name}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        )}
        
        {/* Floating Particles */}
        <div className="absolute inset-0 chinese-pattern opacity-20" />
        
        {/* Content Container */}
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Main Business Info */}
              <div className="lg:col-span-8">
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {/* Business Name with 3D Effect */}
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 font-chinese tracking-tight">
                    <span className="bg-gradient-to-r from-white via-chinese-gold-200 to-white bg-clip-text text-transparent drop-shadow-2xl">
                      {localized.name}
                    </span>
                  </h1>
                  
                  {/* Enhanced Rating Display */}
                  {averageRating > 0 && (
                    <motion.div 
                      className="flex items-center space-x-4"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex items-center bg-white/20 backdrop-blur-md rounded-xl px-4 py-2 border border-white/30">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.6 + i * 0.1 }}
                            >
                              <StarIcon
                                className={`h-5 w-5 ${
                                  i < Math.floor(averageRating)
                                    ? 'text-chinese-gold-400 fill-current drop-shadow-lg'
                                    : 'text-white/40'
                                }`}
                              />
                            </motion.div>
                          ))}
                        </div>
                        <span className="ml-3 text-white font-semibold text-lg">
                          {averageRating.toFixed(1)}
                        </span>
                      </div>
                      <div className="bg-chinese-gold-500/20 backdrop-blur-md rounded-xl px-4 py-2 border border-chinese-gold-300/30">
                        <span className="text-white font-medium">
                          {business.reviews?.length || 0} {locale === 'zh' ? '评论' : 'reviews'}
                        </span>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Location with Enhanced Design */}
                  {business.location && (
                    <motion.div 
                      className="flex items-center bg-white/15 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20 w-fit"
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.25)" }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <MapPinIcon className="h-5 w-5 mr-3 text-chinese-red-300" />
                      <span className="text-white font-medium text-lg">
                        {business.location.city}, {business.location.state}
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="lg:col-span-4 flex flex-col space-y-4">
                <motion.div 
                  className="flex flex-col space-y-3"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  {/* Like Button */}
                  <motion.button
                    onClick={() => setIsLiked(!isLiked)}
                    className="group flex items-center justify-center bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-2xl px-6 py-4 border border-white/30 transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      animate={{ scale: isLiked ? [1, 1.3, 1] : 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {isLiked ? (
                        <HeartSolidIcon className="h-6 w-6 text-chinese-red-400" />
                      ) : (
                        <HeartIcon className="h-6 w-6 text-white group-hover:text-chinese-red-300" />
                      )}
                    </motion.div>
                    <span className="ml-3 text-white font-medium">
                      {locale === 'zh' ? '收藏' : 'Save'}
                    </span>
                  </motion.button>

                  {/* Enhanced Share Button */}
                  <div className="relative">
                    <motion.button
                      onClick={handleShare}
                      className="group w-full flex items-center justify-center bg-gradient-to-r from-chinese-gold-500 to-chinese-gold-600 hover:from-chinese-gold-600 hover:to-chinese-gold-700 rounded-2xl px-6 py-4 text-white font-semibold shadow-xl hover:shadow-chinese-gold transition-all duration-300"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ShareIcon className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                      <span>{locale === 'zh' ? '分享' : 'Share'}</span>
                    </motion.button>

                    {/* Share Menu */}
                    <AnimatePresence>
                      {showShareMenu && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/30 p-4 z-20"
                        >
                          <div className="grid grid-cols-2 gap-2">
                            <button className="p-3 rounded-lg hover:bg-chinese-red-50 transition-colors text-sm font-medium text-chinese-ink-700">
                              {locale === 'zh' ? '复制链接' : 'Copy Link'}
                            </button>
                            <button className="p-3 rounded-lg hover:bg-chinese-red-50 transition-colors text-sm font-medium text-chinese-ink-700">
                              {locale === 'zh' ? '微信' : 'WeChat'}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* View Counter */}
                  <motion.div 
                    className="flex items-center justify-center bg-chinese-jade-500/20 backdrop-blur-md rounded-xl px-4 py-3 border border-chinese-jade-300/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <EyeIcon className="h-5 w-5 text-chinese-jade-300 mr-2" />
                    <span className="text-white font-medium text-sm">
                      {viewCount} {locale === 'zh' ? '浏览' : 'views'}
                    </span>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 w-4 h-4 bg-chinese-gold-400/30 rounded-full blur-sm"
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-32 right-20 w-6 h-6 bg-chinese-red-400/20 rounded-full blur-sm"
          animate={{ 
            y: [0, 15, 0],
            opacity: [0.2, 0.6, 0.2]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </motion.div>
    </section>
  );
}