'use client';

import { useTranslations } from 'next-intl';
import { type Business, type BusinessLocalized } from '@/lib/api';

interface BusinessInfoProps {
  business: Business;
  localized: BusinessLocalized;
  locale: 'en' | 'zh';
}

export function BusinessInfo({ business, localized, locale }: BusinessInfoProps) {
  const t = useTranslations('business');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        About {localized.name}
      </h2>
      
      {localized.description && (
        <div className="prose max-w-none text-gray-700 mb-8">
          <p>{localized.description}</p>
        </div>
      )}
      
      {business.categories && business.categories.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {business.categories.map(({ category }) => (
              <span 
                key={category.id}
                className="inline-flex items-center px-3 py-1 bg-chinese-red-100 text-chinese-red-800 text-sm font-medium rounded-full"
              >
                {category.icon && <span className="mr-1">{category.icon}</span>}
                {locale === 'zh' ? category.nameZh : category.nameEn}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}