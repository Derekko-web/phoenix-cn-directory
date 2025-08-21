'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

export const Footer = () => {
  const tFooter = useTranslations('footer');
  
  return (
    <footer className="bg-gray-900 text-white mt-16">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                凤
              </div>
              <div>
                <div className="text-lg font-bold text-white">
                  Phoenix Chinese Directory
                </div>
                <div className="text-sm text-gray-300">
                  凤凰城华人目录
                </div>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              {tFooter('description')}
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              <a 
                href="mailto:hello@phoenixcn.com" 
                className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition-colors"
                aria-label="Email"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </a>
              <div className="bg-gray-800 p-3 rounded-lg">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.2 3H4.8C3.806 3 3 3.806 3 4.8v14.4c0 .994.806 1.8 1.8 1.8h14.4c.994 0 1.8-.806 1.8-1.8V4.8c0-.994-.806-1.8-1.8-1.8zM8.4 18.6H5.7V9.9h2.7v8.7zM7.05 8.73c-.864 0-1.56-.696-1.56-1.56s.696-1.56 1.56-1.56 1.56.696 1.56 1.56-.696 1.56-1.56 1.56zM18.3 18.6h-2.7v-4.23c0-1.008-.018-2.304-1.404-2.304-1.404 0-1.62 1.098-1.62 2.232V18.6H9.9V9.9h2.592v1.188h.036c.36-.684 1.242-1.404 2.556-1.404 2.736 0 3.24 1.8 3.24 4.14v4.776z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">
              {tFooter('quickLinks')}
            </h3>
            <div className="space-y-3">
              <Link 
                href="/en/businesses" 
                className="block text-gray-300 hover:text-white transition-colors"
              >
                All Businesses
              </Link>
              <Link 
                href="/en/categories" 
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Categories
              </Link>
              <Link 
                href="/en/submit-business" 
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Add Your Business
              </Link>
              <Link 
                href="/en/community" 
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Community
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-white mb-4">
              {tFooter('contactUs')}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Phoenix, Arizona</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="text-sm">hello@phoenixcn.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">24/7 Community Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              {tFooter('copyright')}
            </div>
            <div className="flex gap-6 text-sm">
              <Link 
                href="/privacy" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};