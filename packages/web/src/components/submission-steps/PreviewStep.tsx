'use client';

import { useTranslations } from 'next-intl';
import { 
  EyeIcon, 
  BuildingStorefrontIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  ClockIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

import type { BusinessSubmissionData } from '@/types/submission';

interface PreviewStepProps {
  data: BusinessSubmissionData;
  locale: 'en' | 'zh';
}

const DAYS_OF_WEEK = {
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  zh: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
};

export function PreviewStep({ data, locale }: PreviewStepProps) {
  const t = useTranslations('submitBusiness.steps.preview');

  const localizedContent = data.localized.find(l => l.lang === locale) || data.localized[0];
  const sortedHours = [...data.hours].sort((a, b) => a.dayOfWeek - b.dayOfWeek);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <EyeIcon className="h-12 w-12 text-chinese-red-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('title')}
        </h2>
        <p className="text-gray-600">
          {t('description')}
        </p>
      </div>

      {/* Preview Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-2 border-chinese-red-200 rounded-xl shadow-lg overflow-hidden"
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-chinese-red-600 to-chinese-gold-600 text-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2 font-chinese">
                {localizedContent?.name || t('businessNamePlaceholder')}
              </h1>
              {localizedContent?.description && (
                <p className="text-white/90">
                  {localizedContent.description}
                </p>
              )}
            </div>
            <BuildingStorefrontIcon className="h-8 w-8 text-white/80" />
          </div>

          {/* Categories */}
          {data.categories.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {data.categories.map((category) => (
                <span
                  key={category.id}
                  className="inline-flex items-center px-3 py-1 bg-white/20 text-white text-sm rounded-full"
                >
                  {category.icon && <span className="mr-1">{category.icon}</span>}
                  {locale === 'zh' ? category.nameZh : category.nameEn}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 space-y-6">
          {/* Location */}
          {data.location.addressLines[0] && (
            <div className="flex items-start space-x-3">
              <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="text-gray-700">
                {data.location.addressLines.filter(line => line.trim()).map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
                <div>
                  {data.location.city}, {data.location.state} {data.location.zip}
                </div>
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="space-y-3">
            {data.contact.phone && (
              <div className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-700">{data.contact.phone}</span>
              </div>
            )}

            {data.contact.email && (
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-700">{data.contact.email}</span>
              </div>
            )}

            {data.contact.website && (
              <div className="flex items-center space-x-3">
                <GlobeAltIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-700 break-all">{data.contact.website}</span>
              </div>
            )}
          </div>

          {/* Business Hours */}
          {sortedHours.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <ClockIcon className="h-5 w-5 mr-2 text-gray-500" />
                {t('businessHours')}
              </h3>
              <div className="space-y-2">
                {sortedHours.map((hour) => {
                  const dayName = DAYS_OF_WEEK[locale][hour.dayOfWeek];
                  
                  return (
                    <div key={hour.dayOfWeek} className="flex justify-between items-center py-1">
                      <span className="font-medium text-gray-700 w-24">
                        {dayName}
                      </span>
                      <span className="text-gray-600">
                        {hour.isClosed ? (
                          t('closed')
                        ) : hour.is24h ? (
                          t('24hours')
                        ) : (
                          `${hour.openTime} - ${hour.closeTime}`
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Photos Preview */}
          {data.photos && data.photos.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <TagIcon className="h-5 w-5 mr-2 text-gray-500" />
                {t('photos')} ({data.photos.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {data.photos.slice(0, 6).map((photo, index) => (
                  <div key={photo.id} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={photo.preview || photo.url}
                      alt={photo.caption || `Business photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {photo.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-2 truncate">
                        {photo.caption}
                      </div>
                    )}
                  </div>
                ))}
                {data.photos.length > 6 && (
                  <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm font-medium">
                    +{data.photos.length - 6} more
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Status Banner */}
        <div className="bg-yellow-50 border-t border-yellow-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-800">
                <span className="font-medium">{t('pendingStatus')}</span> - {t('pendingStatusDescription')}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Submission Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('submissionSummary')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">{t('businessName')}:</span>
              <span className="text-gray-900">
                {localizedContent?.name ? '✓' : '✗'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('categories')}:</span>
              <span className="text-gray-900">
                {data.categories.length > 0 ? `✓ (${data.categories.length})` : '✗'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('address')}:</span>
              <span className="text-gray-900">
                {data.location.addressLines[0] ? '✓' : '✗'}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">{t('contactInfo')}:</span>
              <span className="text-gray-900">
                {(data.contact.phone || data.contact.email || data.contact.website) ? '✓' : '✗'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('businessHours')}:</span>
              <span className="text-gray-900">
                {data.hours.length > 0 ? `✓ (${data.hours.length} days)` : t('optional')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('photos')}:</span>
              <span className="text-gray-900">
                {data.photos && data.photos.length > 0 ? `✓ (${data.photos.length})` : t('optional')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Final Instructions */}
      <div className="bg-chinese-red-50 border border-chinese-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-chinese-red-800 mb-2">
          {t('finalInstructions')}
        </h3>
        <ul className="text-chinese-red-700 text-sm space-y-1">
          <li>• {t('instruction1')}</li>
          <li>• {t('instruction2')}</li>
          <li>• {t('instruction3')}</li>
          <li>• {t('instruction4')}</li>
        </ul>
      </div>

      {/* Double-check prompt */}
      <div className="text-center">
        <p className="text-gray-600 mb-4">
          {t('doubleCheck')}
        </p>
        <p className="text-sm text-gray-500">
          {t('submitConfirmation')}
        </p>
      </div>
    </div>
  );
}