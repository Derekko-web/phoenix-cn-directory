'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  locale: 'en' | 'zh';
  initialSearch?: string;
}

export function SearchBar({ locale, initialSearch }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('search');
  
  const [searchQuery, setSearchQuery] = useState(initialSearch || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    
    // Build new search params
    const params = new URLSearchParams(searchParams.toString());
    params.set('search', searchQuery.trim());
    params.delete('page'); // Reset to page 1 when searching
    
    // Navigate to businesses page with search query
    router.push(`/${locale}/businesses?${params.toString()}`);
    
    setIsLoading(false);
  };

  const handleClear = () => {
    setSearchQuery('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    params.delete('page');
    
    router.push(`/${locale}/businesses?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative search-bar" role="search" aria-label="Search businesses">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        
        <label htmlFor="business-search" className="sr-only">
          {t('placeholder')}
        </label>
        <input
          id="business-search"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('placeholder')}
          className="w-full pl-10 md:pl-12 pr-16 md:pr-20 py-3 md:py-4 text-base md:text-lg border-0 rounded-xl bg-white/95 backdrop-blur-sm shadow-lg focus:ring-2 focus:ring-chinese-gold-500 focus:bg-white transition-all duration-200 placeholder-gray-500"
          disabled={isLoading}
          aria-label={t('placeholder')}
          aria-describedby="search-help"
        />
        
        <div className="absolute inset-y-0 right-0 pr-2 flex items-center space-x-1 md:space-x-2">
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="px-2 md:px-3 py-2 text-xs md:text-sm text-gray-500 hover:text-gray-700 transition-colors"
              disabled={isLoading}
              aria-label={t('clear')}
            >
              {t('clear')}
            </button>
          )}
          
          <button
            type="submit"
            disabled={!searchQuery.trim() || isLoading}
            className="px-4 md:px-6 py-2 bg-chinese-red-600 text-white rounded-lg hover:bg-chinese-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm md:text-base"
            aria-label={isLoading ? t('searching') : t('search')}
          >
            {isLoading ? t('searching') : t('search')}
          </button>
        </div>
      </div>
      
      {/* Search Suggestions */}
      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-60 overflow-y-auto hidden">
        <div className="p-4 text-sm text-gray-500">
          {t('suggestions')}
        </div>
      </div>
    </form>
  );
}