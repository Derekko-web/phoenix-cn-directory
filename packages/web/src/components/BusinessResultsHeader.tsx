'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { 
  Squares2X2Icon, 
  ListBulletIcon,
  ChevronDownIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

interface BusinessResultsHeaderProps {
  locale: 'en' | 'zh';
  total: number;
  offset: number;
  itemsPerPage: number;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const SORT_OPTIONS = [
  { value: 'relevance', labelKey: 'relevance' },
  { value: 'name', labelKey: 'name' },
  { value: 'rating', labelKey: 'rating' },
  { value: 'newest', labelKey: 'newest' },
  { value: 'distance', labelKey: 'distance' },
] as const;

export function BusinessResultsHeader({
  locale,
  total,
  offset,
  itemsPerPage,
  viewMode,
  onViewModeChange,
}: BusinessResultsHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('businesses');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  
  const currentSort = searchParams.get('sort') || 'relevance';
  
  const handleSortChange = (sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sortValue === 'relevance') {
      params.delete('sort');
    } else {
      params.set('sort', sortValue);
    }
    params.delete('page'); // Reset to page 1
    router.push(`/${locale}/businesses?${params.toString()}`);
    setShowSortDropdown(false);
  };

  const getSortLabel = (sortValue: string) => {
    const option = SORT_OPTIONS.find(opt => opt.value === sortValue);
    return option ? t(`sort.${option.labelKey}`) : t('sort.relevance');
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      {/* Results Count */}
      <div className="flex items-center text-gray-600">
        <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2 text-gray-400" />
        <span className="text-sm font-medium">
          {t('resultsCount', { 
            start: offset + 1, 
            end: Math.min(offset + itemsPerPage, total), 
            total 
          })}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {t('sortBy')}: {getSortLabel(currentSort)}
            <ChevronDownIcon className="ml-2 h-4 w-4" />
          </button>
          
          {showSortDropdown && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowSortDropdown(false)}
              />
              
              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                <div className="py-1">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        currentSort === option.value
                          ? 'bg-chinese-red-50 text-chinese-red-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {t(`sort.${option.labelKey}`)}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'grid'
                ? 'bg-white text-chinese-red-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Squares2X2Icon className="h-4 w-4 mr-1.5" />
            {t('viewMode.grid')}
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-chinese-red-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ListBulletIcon className="h-4 w-4 mr-1.5" />
            {t('viewMode.list')}
          </button>
        </div>
      </div>
    </div>
  );
}