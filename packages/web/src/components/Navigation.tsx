'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

export const Navigation = () => {
  const t = useTranslations('nav');
  const authT = useTranslations('auth.profile');
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  
  const currentLocale = pathname.startsWith('/zh') ? 'zh' : 'en';
  const toggleLocale = currentLocale === 'en' ? 'zh' : 'en';
  const togglePath = pathname.replace(`/${currentLocale}`, `/${toggleLocale}`);

  const navigationItems = [
    { key: 'home', href: `/${currentLocale}` },
    { key: 'businesses', href: `/${currentLocale}/businesses` },
    { key: 'events', href: `/${currentLocale}/events` },
    { key: 'about', href: `/${currentLocale}/about` },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${currentLocale}`} className="group">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-chinese-red-500 to-chinese-gold-500 rounded-xl flex items-center justify-center text-white font-chinese font-bold text-xl shadow-lg">
                凤
              </div>
              <div className="hidden md:block">
                <div className="text-lg font-bold bg-gradient-to-r from-chinese-red-600 to-chinese-gold-600 bg-clip-text text-transparent">
                  {currentLocale === 'zh' ? '凤凰城华人目录' : 'Phoenix Chinese Directory'}
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Navigation links */}
          <div className="hidden md:flex items-center gap-8">
            {navigationItems.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                className="relative text-chinese-ink-600 hover:text-chinese-red-600 transition-colors duration-200 font-medium"
              >
                {t(key as any)}
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-chinese-red-500 to-chinese-gold-500 origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </Link>
            ))}
          </div>

          {/* Auth buttons, Add Business Button & Language toggle */}
          <div className="flex items-center gap-4">
            {/* Auth buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link href={`/${currentLocale}/dashboard`}>
                  <span className="text-sm text-chinese-ink-600 hover:text-chinese-red-600 transition-colors">
                    {currentLocale === 'zh' ? '仪表板' : 'Dashboard'}
                  </span>
                </Link>
                <div className="h-4 w-px bg-gray-300"></div>
                <span className="text-sm text-chinese-ink-600">
                  {authT('welcome')}, {user?.firstName || user?.email?.split('@')[0]}
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-chinese-ink-600 hover:text-chinese-red-600 transition-colors"
                >
                  {authT('logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href={`/${currentLocale}/login`}>
                  <span className="text-sm text-chinese-ink-600 hover:text-chinese-red-600 transition-colors">
                    {currentLocale === 'zh' ? '登录' : 'Login'}
                  </span>
                </Link>
                <Link href={`/${currentLocale}/register`}>
                  <span className="text-sm bg-chinese-red-600 text-white px-3 py-1 rounded-lg hover:bg-chinese-red-700 transition-colors">
                    {currentLocale === 'zh' ? '注册' : 'Register'}
                  </span>
                </Link>
              </div>
            )}

            {/* Add Business Button */}
            <Link href={`/${currentLocale}/submit-business`}>
              <motion.div
                className="bg-chinese-gold-600 text-white px-4 py-2 rounded-lg hover:bg-chinese-gold-700 transition-colors font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="hidden md:block">
                  {currentLocale === 'zh' ? '添加商家' : 'Add Business'}
                </span>
                <span className="md:hidden">+</span>
              </motion.div>
            </Link>
            
            {/* Language Toggle */}
            <Link href={togglePath}>
              <motion.div
                className="glass rounded-full p-2 hover:bg-white/30 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <div className="flex items-center gap-2 px-3 py-1">
                  <div className="text-sm font-medium text-chinese-ink-600">
                    {currentLocale === 'en' ? '中文' : 'EN'}
                  </div>
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-chinese-red-500 to-chinese-gold-500" />
                </div>
              </motion.div>
            </Link>

            {/* Mobile menu button */}
            <motion.button
              className="md:hidden glass rounded-full p-3"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <svg className="w-5 h-5 text-chinese-ink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />

            {/* Mobile Menu */}
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl z-50 md:hidden overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-chinese-red-500 to-chinese-gold-500 rounded-lg flex items-center justify-center text-white font-chinese font-bold text-lg">
                      凤
                    </div>
                    <div className="text-lg font-bold bg-gradient-to-r from-chinese-red-600 to-chinese-gold-600 bg-clip-text text-transparent">
                      {currentLocale === 'zh' ? '华人目录' : 'Directory'}
                    </div>
                  </div>
                  <motion.button
                    onClick={closeMobileMenu}
                    className="p-2 rounded-full hover:bg-gray-100"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <XMarkIcon className="h-6 w-6 text-gray-600" />
                  </motion.button>
                </div>

                {/* Navigation Links */}
                <div className="space-y-1 mb-8">
                  {navigationItems.map(({ key, href }, index) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={href}
                        onClick={closeMobileMenu}
                        className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-chinese-red-50 hover:text-chinese-red-600 transition-all duration-200 font-medium"
                      >
                        {t(key as any)}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Add Business Button */}
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link href={`/${currentLocale}/submit-business`} onClick={closeMobileMenu}>
                    <div className="w-full bg-chinese-gold-600 text-white px-6 py-3 rounded-lg hover:bg-chinese-gold-700 transition-colors font-medium text-center">
                      {currentLocale === 'zh' ? '添加商家' : 'Add Business'}
                    </div>
                  </Link>
                </motion.div>

                {/* Language Toggle */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link href={togglePath} onClick={closeMobileMenu}>
                    <div className="flex items-center justify-center gap-3 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="text-gray-700 font-medium">
                        {currentLocale === 'en' ? '切换到中文' : 'Switch to English'}
                      </div>
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-chinese-red-500 to-chinese-gold-500" />
                    </div>
                  </Link>
                </motion.div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
                  {currentLocale === 'zh' ? '凤凰城华人商家目录' : 'Phoenix Chinese Business Directory'}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};