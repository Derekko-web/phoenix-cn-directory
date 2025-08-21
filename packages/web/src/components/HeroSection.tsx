'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export const HeroSection = () => {
  const t = useTranslations('home');

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center chinese-pattern overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-chinese-red-500/10 via-chinese-gold-500/5 to-chinese-jade-500/10" />
      
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-chinese-red-500/20 to-chinese-gold-500/20 rounded-full blur-xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-chinese-jade-500/20 to-chinese-red-500/20 rounded-full blur-xl"
          animate={{
            x: [0, -25, 0],
            y: [0, 15, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute bottom-32 left-1/3 w-20 h-20 bg-gradient-to-r from-chinese-gold-500/15 to-chinese-jade-500/15 rounded-full blur-xl"
          animate={{
            x: [0, 20, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Main title with gradient text */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 font-chinese">
            <span className="bg-gradient-to-r from-chinese-red-600 via-chinese-gold-600 to-chinese-jade-600 bg-clip-text text-transparent">
              {t('title')}
            </span>
          </h1>

          {/* Subtitle */}
          <motion.p 
            className="text-xl md:text-2xl text-chinese-ink-600 mb-12 leading-relaxed font-chinese"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t('subtitle')}
          </motion.p>
        </motion.div>

        {/* Search bar with glassmorphism */}
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-chinese-red-500 via-chinese-gold-500 to-chinese-jade-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
            <div className="relative glass rounded-2xl p-1">
              <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-xl px-6 py-4">
                <svg 
                  className="w-6 h-6 text-chinese-ink-400 mr-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  className="flex-1 bg-transparent border-none outline-none text-lg placeholder-chinese-ink-400 font-chinese"
                />
                <button className="ml-4 bg-gradient-to-r from-chinese-red-500 to-chinese-gold-500 text-white px-6 py-2 rounded-lg hover:from-chinese-red-600 hover:to-chinese-gold-600 transition-all duration-300 font-medium">
                  搜索
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Floating call-to-action */}
        <motion.div
          className="mt-12 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="glass rounded-full px-6 py-2 text-chinese-ink-600 font-medium">
            🏮 凤凰城华人社区
          </div>
          <div className="glass rounded-full px-6 py-2 text-chinese-ink-600 font-medium">
            🌟 精选优质商家
          </div>
          <div className="glass rounded-full px-6 py-2 text-chinese-ink-600 font-medium">
            🔍 快速便捷搜索
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-6 h-10 border-2 border-chinese-red-300 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-chinese-red-400 rounded-full mt-2 animate-pulse" />
        </div>
      </motion.div>
    </div>
  );
};