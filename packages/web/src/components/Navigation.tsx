'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SparklesIcon, ChevronDownIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

export const Navigation = () => {
  const t = useTranslations('nav');
  const currentLocale = useLocale() as 'en' | 'zh';
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleLocale = currentLocale === 'en' ? 'zh' : 'en';
  
  // Generate the toggle path dynamically based on current pathname
  const getTogglePath = () => {
    if (!pathname) return `/${toggleLocale}`;
    
    // Handle different pathname cases
    if (pathname === '/' || pathname === '/en' || pathname === '/zh') {
      return `/${toggleLocale}`;
    } else if (pathname.startsWith(`/${currentLocale}/`)) {
      // Replace current locale with toggle locale
      return pathname.replace(`/${currentLocale}/`, `/${toggleLocale}/`);
    } else if (pathname.startsWith('/en/') || pathname.startsWith('/zh/')) {
      // Replace any locale prefix with toggle locale
      return pathname.replace(/^\/(en|zh)\//, `/${toggleLocale}/`);
    } else {
      // If no locale in path, prepend toggle locale
      return `/${toggleLocale}${pathname}`;
    }
  };

  const togglePath = getTogglePath();

  // Scroll detection for enhanced navigation styling
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigationItems = [
    { key: 'home', href: `/${currentLocale}` },
    { key: 'businesses', href: `/${currentLocale}/businesses` },
    { key: 'categories', href: `/${currentLocale}/categories` },
    { key: 'services', href: `/${currentLocale}/services` },
    { key: 'community', href: `/${currentLocale}/community` },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50' 
          : 'glass border-b border-white/10'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href={`/${currentLocale}`} className="group shrink-0">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-chinese-red-500 to-chinese-gold-500 rounded-xl flex items-center justify-center text-white font-chinese font-bold text-xl shadow-lg">
                凤
              </div>
              <div className="hidden lg:block">
                <div className="text-lg font-bold bg-gradient-to-r from-chinese-red-600 to-chinese-gold-600 bg-clip-text text-transparent">
                  {currentLocale === 'zh' ? '凤凰城华人目录' : 'Phoenix Chinese Directory'}
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Navigation links */}
          <div className="hidden lg:flex items-center gap-1">
            {navigationItems.map(({ key, href }) => (
              <Link
                key={key}
                href={href as any}
                className="group relative"
              >
                <motion.div
                  className="relative px-4 py-2 rounded-lg text-chinese-ink-600 hover:text-chinese-red-600 transition-all duration-200 font-medium"
                  whileHover={{ y: -1 }}
                  whileTap={{ y: 0 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-chinese-red-50 rounded-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                  <span className="relative z-10">{t(key as any)}</span>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-3">
            {/* Auth section */}
            {!isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <Link href={`/${currentLocale}/login`}>
                  <motion.span 
                    className="text-sm text-chinese-ink-600 hover:text-chinese-red-600 transition-colors font-medium px-3 py-1.5 rounded-lg hover:bg-chinese-red-50"
                    whileHover={{ y: -1 }}
                  >
                    {currentLocale === 'zh' ? '登录' : 'Login'}
                  </motion.span>
                </Link>
                <Link href={`/${currentLocale}/register`}>
                  <motion.span 
                    className="text-sm bg-gradient-to-r from-chinese-red-600 to-chinese-red-700 text-white px-4 py-1.5 rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
                    whileHover={{ y: -2, boxShadow: "0 10px 25px rgba(220, 38, 38, 0.3)" }}
                    whileTap={{ y: 0 }}
                  >
                    {currentLocale === 'zh' ? '注册' : 'Register'}
                  </motion.span>
                </Link>
              </div>
            ) : (
              /* User Dropdown */
              <div className="hidden md:flex items-center relative" ref={dropdownRef}>
                <motion.button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-chinese-ink-600 hover:text-chinese-red-600 hover:bg-chinese-red-50 transition-all duration-200 font-medium"
                  whileHover={{ y: -1 }}
                  whileTap={{ y: 0 }}
                >
                  <UserCircleIcon className="h-5 w-5" />
                  <span className="text-sm">
                    {user?.email?.split('@')[0] || (currentLocale === 'zh' ? '用户' : 'User')}
                  </span>
                  <motion.div
                    animate={{ rotate: userDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDownIcon className="h-4 w-4" />
                  </motion.div>
                </motion.button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200/50 backdrop-blur-xl z-50"
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="py-2">
                        <Link
                          href={`/${currentLocale}/dashboard`}
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-chinese-ink-600 hover:bg-chinese-red-50 hover:text-chinese-red-600 transition-colors"
                        >
                          <div className="w-2 h-2 rounded-full bg-chinese-gold-500" />
                          {currentLocale === 'zh' ? '仪表板' : 'Dashboard'}
                        </Link>
                        <Link
                          href={`/${currentLocale}/profile` as any}
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-chinese-ink-600 hover:bg-chinese-red-50 hover:text-chinese-red-600 transition-colors"
                        >
                          <div className="w-2 h-2 rounded-full bg-chinese-jade-500" />
                          {currentLocale === 'zh' ? '个人资料' : 'Profile'}
                        </Link>
                        <hr className="my-2 border-gray-200" />
                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-chinese-ink-600 hover:bg-chinese-red-50 hover:text-chinese-red-600 transition-colors text-left"
                        >
                          <div className="w-2 h-2 rounded-full bg-chinese-red-500" />
                          {currentLocale === 'zh' ? '退出登录' : 'Sign Out'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Enhanced Add Business Button */}
            <Link href={`/${currentLocale}/submit-business` as any}>
              <motion.div
                className="relative group"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative overflow-hidden bg-chinese-red-600 p-[2px] rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
                  {/* Inner content container */}
                  <div className="relative bg-white rounded-[10px] px-4 py-3 overflow-hidden">
                    {/* Simple hover background */}
                    <motion.div
                      className="absolute inset-0 bg-chinese-red-50"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    {/* Content */}
                    <div className="relative z-10 flex items-center gap-2">
                      {/* Animated sparkle icon */}
                      <motion.div
                        animate={{ 
                          rotate: [0, 15, -15, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <SparklesIcon className="h-5 w-5 text-chinese-red-600 group-hover:text-chinese-red-700 transition-colors duration-300" />
                      </motion.div>
                      
                      {/* Text */}
                      <span className="hidden lg:block text-sm font-bold text-chinese-red-600 group-hover:text-chinese-red-700 transition-colors duration-300">
                        {currentLocale === 'zh' ? '添加商家' : 'Add Business'}
                      </span>
                      
                      {/* Mobile plus icon */}
                      <motion.span 
                        className="lg:hidden text-lg font-bold text-chinese-red-600"
                        whileHover={{ rotate: 90 }}
                        transition={{ duration: 0.2 }}
                      >
                        +
                      </motion.span>
                      
                      {/* Arrow icon */}
                      <motion.div
                        className="hidden lg:block"
                        initial={{ x: 0 }}
                        whileHover={{ x: 3 }}
                        transition={{ duration: 0.2 }}
                      >
                        <svg className="w-4 h-4 text-chinese-red-600 group-hover:text-chinese-red-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </motion.div>
                    </div>
                    
                    {/* Floating particles effect */}
                    <motion.div
                      className="absolute top-1 right-1 w-1 h-1 bg-chinese-red-400 rounded-full"
                      animate={{
                        y: [0, -8, 0],
                        opacity: [0.3, 1, 0.3]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.div
                      className="absolute bottom-1 left-1 w-1 h-1 bg-chinese-red-500 rounded-full"
                      animate={{
                        y: [0, -6, 0],
                        opacity: [0.2, 0.8, 0.2]
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            </Link>
            
            {/* Enhanced Language Toggle */}
            <Link href={togglePath as any}>
              <motion.div
                className="relative group"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative overflow-hidden bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 hover:border-chinese-red-300 rounded-xl px-4 py-2.5 shadow-md hover:shadow-lg transition-all duration-300">
                  {/* Animated background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-chinese-red-50 to-chinese-gold-50"
                    initial={{ opacity: 0, x: '-100%' }}
                    whileHover={{ opacity: 1, x: '0%' }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Content */}
                  <div className="relative z-10 flex items-center gap-2">
                    {/* Globe icon */}
                    <motion.div
                      animate={{ rotate: currentLocale === 'en' ? 0 : 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg className="w-4 h-4 text-chinese-ink-500 group-hover:text-chinese-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </motion.div>
                    
                    {/* Language text */}
                    <span className="text-sm font-semibold text-chinese-ink-700 group-hover:text-chinese-red-700 transition-colors tracking-wide">
                      {currentLocale === 'en' ? '中文' : 'EN'}
                    </span>
                    
                    {/* Indicator dot */}
                    <motion.div
                      className="w-2 h-2 rounded-full bg-chinese-gold-400 group-hover:bg-chinese-red-500 transition-colors shadow-sm"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                  
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    initial={{ x: '-100%', opacity: 0 }}
                    whileHover={{ x: '100%', opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </motion.div>
            </Link>

            {/* Mobile menu button */}
            <motion.button
              className="md:hidden bg-chinese-ink-100 text-chinese-ink-600 rounded-full p-2.5"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <motion.div
                animate={isMobileMenuOpen ? { rotate: 90 } : { rotate: 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobileMenu}
          >
            <motion.div
              className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl"
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              id="mobile-menu"
            >
              <div className="p-6 h-full overflow-y-auto">
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
                    aria-label="Close navigation menu"
                  >
                    <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
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
                        href={href as any}
                        onClick={closeMobileMenu}
                        className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-chinese-red-50 hover:text-chinese-red-600 transition-all duration-200 font-medium"
                      >
                        {t(key as any)}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Auth Section for Mobile */}
                {!isAuthenticated ? (
                  <div className="space-y-3 mb-6">
                    <Link href={`/${currentLocale}/login`} onClick={closeMobileMenu}>
                      <div className="w-full border border-chinese-red-600 text-chinese-red-600 px-6 py-3 rounded-lg hover:bg-chinese-red-50 transition-colors font-medium text-center">
                        {currentLocale === 'zh' ? '登录' : 'Login'}
                      </div>
                    </Link>
                    <Link href={`/${currentLocale}/register`} onClick={closeMobileMenu}>
                      <div className="w-full bg-chinese-red-600 text-white px-6 py-3 rounded-lg hover:bg-chinese-red-700 transition-colors font-medium text-center">
                        {currentLocale === 'zh' ? '注册' : 'Register'}
                      </div>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3 mb-6">
                    {/* User info header */}
                    <div className="px-4 py-3 bg-chinese-red-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <UserCircleIcon className="h-8 w-8 text-chinese-red-600" />
                        <div>
                          <div className="font-medium text-chinese-ink-800">
                            {user?.email?.split('@')[0] || (currentLocale === 'zh' ? '用户' : 'User')}
                          </div>
                          <div className="text-sm text-chinese-ink-500">
                            {user?.email || ''}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Link href={`/${currentLocale}/dashboard`} onClick={closeMobileMenu}>
                      <div className="w-full border border-chinese-red-600 text-chinese-red-600 px-6 py-3 rounded-lg hover:bg-chinese-red-50 transition-colors font-medium text-center">
                        {currentLocale === 'zh' ? '仪表板' : 'Dashboard'}
                      </div>
                    </Link>
                    <Link href={`/${currentLocale}/profile` as any} onClick={closeMobileMenu}>
                      <div className="w-full border border-chinese-jade-600 text-chinese-jade-600 px-6 py-3 rounded-lg hover:bg-chinese-jade-50 transition-colors font-medium text-center">
                        {currentLocale === 'zh' ? '个人资料' : 'Profile'}
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        closeMobileMenu();
                      }}
                      className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      {currentLocale === 'zh' ? '退出登录' : 'Sign Out'}
                    </button>
                  </div>
                )}

                {/* Add Business Button */}
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link href={`/${currentLocale}/submit-business` as any} onClick={closeMobileMenu}>
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
                  <Link href={togglePath as any} onClick={closeMobileMenu}>
                    <div className="flex items-center justify-center gap-3 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="text-gray-700 font-medium">
                        {currentLocale === 'en' ? 'Switch to Chinese' : 'Switch to English'}
                      </div>
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-chinese-red-500 to-chinese-gold-500" />
                    </div>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};