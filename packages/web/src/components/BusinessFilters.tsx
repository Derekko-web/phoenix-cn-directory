'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { categoriesApi, type Category } from '@/lib/api';
import { ChevronDownIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface BusinessFiltersProps {
  locale: 'en' | 'zh';
  selectedCategory?: string;
  selectedCity?: string;
}

const PHOENIX_CITIES = [
  'Phoenix',
  'Scottsdale', 
  'Tempe',
  'Mesa',
  'Chandler',
  'Glendale',
  'Peoria',
  'Surprise',
  'Avondale',
  'Goodyear',
];

export function BusinessFilters({ locale, selectedCategory, selectedCity }: BusinessFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('filters');
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCities, setShowCities] = useState(false);
  const [showCategories, setShowCategories] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await categoriesApi.getCategories();
        // Filter for parent categories only
        setCategories(data.filter(cat => !cat.parentId));
      } catch (error) {
        
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const handleFilterChange = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Reset to page 1 when filtering
    params.delete('page');
    
    router.push(`/${locale}/businesses?${params.toString()}`);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    
    router.push(`/${locale}/businesses?${params.toString()}`);
  };

  const hasActiveFilters = selectedCategory || selectedCity;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FunnelIcon className="h-5 w-5 mr-2 text-gray-500" />
            {t('title')}
          </h3>
          
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-chinese-red-600 hover:text-chinese-red-700 transition-colors"
            >
              {t('clearAll')}
            </button>
          )}
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {/* Categories Filter */}
        <div className="p-4 md:p-6">
          <button
            onClick={() => setShowCategories(!showCategories)}
            className="w-full flex items-center justify-between text-left mb-4"
          >
            <h4 className="font-medium text-gray-900">{t('categories')}</h4>
            <ChevronDownIcon 
              className={`h-4 w-4 text-gray-500 transform transition-transform ${
                showCategories ? 'rotate-180' : ''
              }`} 
            />
          </button>
          
          {showCategories && (
            <div className="space-y-3">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
                ))
              ) : (
                <>
                  {/* All Categories Option */}
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={!selectedCategory}
                      onChange={() => handleFilterChange('category', null)}
                      className="h-4 w-4 text-chinese-red-600 focus:ring-chinese-red-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      {t('allCategories')}
                    </span>
                  </label>
                  
                  {/* Category Options */}
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={category.key}
                        checked={selectedCategory === category.key}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="h-4 w-4 text-chinese-red-600 focus:ring-chinese-red-500 border-gray-300"
                      />
                      <span className="ml-3 text-sm text-gray-700 flex items-center">
                        {category.icon && <span className="mr-2">{category.icon}</span>}
                        {locale === 'zh' ? category.nameZh : category.nameEn}
                      </span>
                    </label>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        {/* Cities Filter */}
        <div className="p-4 md:p-6">
          <button
            onClick={() => setShowCities(!showCities)}
            className="w-full flex items-center justify-between text-left mb-4"
          >
            <h4 className="font-medium text-gray-900">{t('cities')}</h4>
            <ChevronDownIcon 
              className={`h-4 w-4 text-gray-500 transform transition-transform ${
                showCities ? 'rotate-180' : ''
              }`} 
            />
          </button>
          
          {showCities && (
            <div className="space-y-3">
              {/* All Cities Option */}
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="city"
                  checked={!selectedCity}
                  onChange={() => handleFilterChange('city', null)}
                  className="h-4 w-4 text-chinese-red-600 focus:ring-chinese-red-500 border-gray-300"
                />
                <span className="ml-3 text-sm text-gray-700">
                  {t('allCities')}
                </span>
              </label>
              
              {/* City Options */}
              {PHOENIX_CITIES.map((city) => (
                <label key={city} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="city"
                    value={city}
                    checked={selectedCity === city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    className="h-4 w-4 text-chinese-red-600 focus:ring-chinese-red-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    {city}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Additional Filters Placeholder */}
        <div className="p-4 md:p-6 text-center text-gray-500 text-sm">
          {t('moreFiltersComingSoon')}
        </div>
      </div>
    </div>
  );
}