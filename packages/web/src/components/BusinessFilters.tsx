'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { categoriesApi, type Category } from '@/lib/api';
import { 
  ChevronDownIcon, 
  FunnelIcon, 
  XMarkIcon,
  AdjustmentsVerticalIcon 
} from '@heroicons/react/24/outline';

interface BusinessFiltersProps {
  locale: 'en' | 'zh';
  selectedCategory?: string;
  selectedCity?: string;
  selectedStatus?: string;
  selectedRating?: string;
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

export function BusinessFilters({ locale, selectedCategory, selectedCity, selectedStatus, selectedRating }: BusinessFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('filters');
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCities, setShowCities] = useState(false);
  const [showCategories, setShowCategories] = useState(true);
  const [showStatus, setShowStatus] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await categoriesApi.getCategories();
        // Filter for parent categories only
        setCategories(data.filter(cat => !cat.parentId));
      } catch (error) {
        // Error handled silently
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

  const hasActiveFilters = selectedCategory || selectedCity || selectedStatus || selectedRating;
  const activeFiltersCount = (selectedCategory ? 1 : 0) + (selectedCity ? 1 : 0) + (selectedStatus ? 1 : 0) + (selectedRating ? 1 : 0);

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm"
        >
          <div className="flex items-center">
            <AdjustmentsVerticalIcon className="h-5 w-5 mr-2 text-gray-500" />
            <span className="font-medium text-gray-900">{t('title')}</span>
            {activeFiltersCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-chinese-red-100 text-chinese-red-700 text-xs font-medium rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <ChevronDownIcon className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      {/* Mobile Filter Modal */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileOpen(false)}
          />
          
          {/* Modal */}
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{t('title')}</h3>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-4">
              {hasActiveFilters && (
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-chinese-red-600 hover:text-chinese-red-700 font-medium"
                  >
                    {t('clearAll')} ({activeFiltersCount})
                  </button>
                </div>
              )}
              
              {/* Mobile Categories */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">{t('categories')}</h4>
                <div className="space-y-3">
                  {loading ? (
                    [...Array(6)].map((_, i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
                    ))
                  ) : (
                    <>
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
              </div>

              {/* Mobile Cities */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">{t('cities')}</h4>
                <div className="space-y-3">
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
              </div>

              {/* Mobile Status */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">{t('status')}</h4>
                <div className="space-y-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={!selectedStatus}
                      onChange={() => handleFilterChange('status', null)}
                      className="h-4 w-4 text-chinese-red-600 focus:ring-chinese-red-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      {t('allStatus')}
                    </span>
                  </label>
                  
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="open"
                      checked={selectedStatus === 'open'}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="h-4 w-4 text-chinese-red-600 focus:ring-chinese-red-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700 flex items-center">
                      <span className="mr-2 h-2 w-2 bg-green-500 rounded-full"></span>
                      {t('openNow')}
                    </span>
                  </label>

                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="closed"
                      checked={selectedStatus === 'closed'}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="h-4 w-4 text-chinese-red-600 focus:ring-chinese-red-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700 flex items-center">
                      <span className="mr-2 h-2 w-2 bg-red-500 rounded-full"></span>
                      {t('closedNow')}
                    </span>
                  </label>
                </div>
              </div>

              {/* Mobile Rating */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">{t('rating')}</h4>
                <div className="space-y-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      checked={!selectedRating}
                      onChange={() => handleFilterChange('rating', null)}
                      className="h-4 w-4 text-chinese-red-600 focus:ring-chinese-red-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      {t('allRatings')}
                    </span>
                  </label>
                  
                  {['4.5', '4.0', '3.5', '3.0'].map((rating) => (
                    <label key={rating} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        checked={selectedRating === rating}
                        onChange={(e) => handleFilterChange('rating', e.target.value)}
                        className="h-4 w-4 text-chinese-red-600 focus:ring-chinese-red-500 border-gray-300"
                      />
                      <span className="ml-3 text-sm text-gray-700 flex items-center">
                        <span className="mr-1">⭐</span>
                        {rating}+ {t('andUp')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="w-full bg-chinese-red-600 text-white py-3 rounded-lg font-medium hover:bg-chinese-red-700 transition-colors"
                >
                  {t('applyFilters')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Filters */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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

          {/* Status Filter */}
          <div className="p-4 md:p-6">
            <button
              onClick={() => setShowStatus(!showStatus)}
              className="w-full flex items-center justify-between text-left mb-4"
            >
              <h4 className="font-medium text-gray-900">{t('status')}</h4>
              <ChevronDownIcon 
                className={`h-4 w-4 text-gray-500 transform transition-transform ${
                  showStatus ? 'rotate-180' : ''
                }`} 
              />
            </button>
            
            {showStatus && (
              <div className="space-y-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={!selectedStatus}
                    onChange={() => handleFilterChange('status', null)}
                    className="h-4 w-4 text-chinese-red-600 focus:ring-chinese-red-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    {t('allStatus')}
                  </span>
                </label>
                
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="open"
                    checked={selectedStatus === 'open'}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="h-4 w-4 text-chinese-red-600 focus:ring-chinese-red-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm text-gray-700 flex items-center">
                    <span className="mr-2 h-2 w-2 bg-green-500 rounded-full"></span>
                    {t('openNow')}
                  </span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="closed"
                    checked={selectedStatus === 'closed'}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="h-4 w-4 text-chinese-red-600 focus:ring-chinese-red-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm text-gray-700 flex items-center">
                    <span className="mr-2 h-2 w-2 bg-red-500 rounded-full"></span>
                    {t('closedNow')}
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Rating Filter */}
          <div className="p-4 md:p-6">
            <button
              onClick={() => setShowRating(!showRating)}
              className="w-full flex items-center justify-between text-left mb-4"
            >
              <h4 className="font-medium text-gray-900">{t('rating')}</h4>
              <ChevronDownIcon 
                className={`h-4 w-4 text-gray-500 transform transition-transform ${
                  showRating ? 'rotate-180' : ''
                }`} 
              />
            </button>
            
            {showRating && (
              <div className="space-y-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    checked={!selectedRating}
                    onChange={() => handleFilterChange('rating', null)}
                    className="h-4 w-4 text-chinese-red-600 focus:ring-chinese-red-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    {t('allRatings')}
                  </span>
                </label>
                
                {['4.5', '4.0', '3.5', '3.0'].map((rating) => (
                  <label key={rating} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      value={rating}
                      checked={selectedRating === rating}
                      onChange={(e) => handleFilterChange('rating', e.target.value)}
                      className="h-4 w-4 text-chinese-red-600 focus:ring-chinese-red-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700 flex items-center">
                      <span className="mr-1">⭐</span>
                      {rating}+ {t('andUp')}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}