'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { MagnifyingGlassIcon, ClockIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  locale: 'en' | 'zh';
  initialSearch?: string;
}

const RECENT_SEARCHES_KEY = 'phoenix-cn-recent-searches';
const MAX_RECENT_SEARCHES = 5;

// Popular search suggestions (could be fetched from API in real implementation)
const getPopularSuggestions = (locale: 'en' | 'zh') => {
  if (locale === 'zh') {
    return ['餐厅', '超市', '银行', '医院', '美容院', '律师', '会计师', '房地产'];
  }
  return ['restaurants', 'grocery stores', 'banks', 'hospitals', 'beauty salons', 'lawyers', 'accountants', 'real estate'];
};

export function SearchBar({ locale, initialSearch }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('search');
  const searchRef = useRef<HTMLDivElement>(null);
  
  const [searchQuery, setSearchQuery] = useState(initialSearch || '');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse recent searches:', e);
      }
    }
  }, []);

  // Update suggestions when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSuggestions([]);
      return;
    }

    const popularSuggestions = getPopularSuggestions(locale);
    const query = searchQuery.toLowerCase();
    const filtered = popularSuggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(query)
    ).slice(0, 5);
    
    setFilteredSuggestions(filtered);
  }, [searchQuery, locale]);

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveToRecentSearches = (query: string) => {
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, MAX_RECENT_SEARCHES);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const removeRecentSearch = (query: string) => {
    const updated = recentSearches.filter(s => s !== query);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const clearAllRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  const performSearch = (query: string) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setShowSuggestions(false);
    
    // Save to recent searches
    saveToRecentSearches(query.trim());
    
    // Build new search params
    const params = new URLSearchParams(searchParams.toString());
    params.set('search', query.trim());
    params.delete('page'); // Reset to page 1 when searching
    
    // Navigate to businesses page with search query
    router.push(`/${locale}/businesses?${params.toString()}`);
    
    setIsLoading(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery('');
    setShowSuggestions(false);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    params.delete('page');
    
    router.push(`/${locale}/businesses?${params.toString()}`);
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    performSearch(suggestion);
  };

  return (
    <div ref={searchRef} className="relative search-bar">
      <form onSubmit={handleSearch} role="search" aria-label="Search businesses">
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
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder={t('placeholder')}
            className="w-full pl-10 md:pl-12 pr-16 md:pr-20 py-3 md:py-4 text-base md:text-lg border-0 rounded-xl bg-white/95 backdrop-blur-sm shadow-lg focus:ring-2 focus:ring-chinese-gold-500 focus:bg-white transition-all duration-200 placeholder-gray-500"
            disabled={isLoading}
            aria-label={t('placeholder')}
            aria-describedby="search-help"
            autoComplete="off"
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
      </form>
      
      {/* Search Suggestions */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto">
          {/* Recent Searches */}
          {recentSearches.length > 0 && !searchQuery.trim() && (
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <ClockIcon className="h-4 w-4" />
                  {t('recentSearches')}
                </h3>
                <button
                  onClick={clearAllRecentSearches}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  {t('clearAll')}
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between group hover:bg-gray-50 rounded px-2 py-1"
                  >
                    <button
                      onClick={() => handleSuggestionClick(search)}
                      className="flex-1 text-left text-sm text-gray-700 hover:text-gray-900"
                    >
                      {search}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeRecentSearch(search);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded"
                    >
                      <XMarkIcon className="h-3 w-3 text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Suggestions */}
          {filteredSuggestions.length > 0 && (
            <div className="p-3">
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <MagnifyingGlassIcon className="h-4 w-4" />
                {t('suggestions')}
              </h3>
              <div className="space-y-1">
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches when no input */}
          {!searchQuery.trim() && recentSearches.length === 0 && (
            <div className="p-3">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                {t('popularSearches')}
              </h3>
              <div className="space-y-1">
                {getPopularSuggestions(locale).slice(0, 6).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {searchQuery.trim() && filteredSuggestions.length === 0 && (
            <div className="p-4 text-center text-sm text-gray-500">
              {t('noSuggestions')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}