'use client';

import { useTranslations } from 'next-intl';
import { MapPinIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

import type { StepProps } from '@/types/submission';

const ARIZONA_CITIES = [
  'Phoenix', 'Scottsdale', 'Tempe', 'Mesa', 'Chandler', 'Glendale',
  'Peoria', 'Surprise', 'Avondale', 'Goodyear', 'Buckeye', 'Gilbert',
  'Ahwatukee', 'Paradise Valley', 'Fountain Hills', 'Cave Creek',
  'Carefree', 'Litchfield Park', 'Tolleson', 'Youngtown'
];

export function LocationStep({ data, onUpdate, locale }: StepProps) {
  const t = useTranslations('submitBusiness.steps.location');

  const updateLocationField = (field: keyof typeof data.location, value: string | string[]) => {
    onUpdate({
      location: {
        ...data.location,
        [field]: value
      }
    });
  };

  const updateAddressLine = (index: number, value: string) => {
    const newAddressLines = [...data.location.addressLines];
    newAddressLines[index] = value;
    updateLocationField('addressLines', newAddressLines);
  };

  const addAddressLine = () => {
    const newAddressLines = [...data.location.addressLines, ''];
    updateLocationField('addressLines', newAddressLines);
  };

  const removeAddressLine = (index: number) => {
    if (data.location.addressLines.length > 1) {
      const newAddressLines = data.location.addressLines.filter((_, i) => i !== index);
      updateLocationField('addressLines', newAddressLines);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <MapPinIcon className="h-12 w-12 text-chinese-red-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('title')}
        </h2>
        <p className="text-gray-600">
          {t('description')}
        </p>
      </div>

      {/* Street Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <BuildingOfficeIcon className="h-4 w-4 inline mr-2" />
          {t('address')} <span className="text-red-500">*</span>
        </label>
        
        {data.location.addressLines.map((line, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={line}
              onChange={(e) => updateAddressLine(index, e.target.value)}
              placeholder={index === 0 ? t('addressLine1Placeholder') : t('addressLine2Placeholder')}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chinese-red-500 focus:border-transparent transition-all"
              required={index === 0}
            />
            
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeAddressLine(index)}
                className="px-3 py-2 text-red-600 hover:text-red-700 transition-colors"
                title={t('removeAddressLine')}
              >
                ×
              </button>
            )}
          </div>
        ))}
        
        {data.location.addressLines.length < 3 && (
          <button
            type="button"
            onClick={addAddressLine}
            className="mt-2 text-sm text-chinese-red-600 hover:text-chinese-red-700 transition-colors"
          >
            + {t('addAddressLine')}
          </button>
        )}
        
        <p className="mt-2 text-sm text-gray-500">
          {t('addressHelp')}
        </p>
      </div>

      {/* City, State, ZIP Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('city')} <span className="text-red-500">*</span>
          </label>
          <select
            value={data.location.city}
            onChange={(e) => updateLocationField('city', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chinese-red-500 focus:border-transparent transition-all"
            required
          >
            <option value="">{t('selectCity')}</option>
            {ARIZONA_CITIES.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('state')}
          </label>
          <select
            value={data.location.state}
            onChange={(e) => updateLocationField('state', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chinese-red-500 focus:border-transparent transition-all"
          >
            <option value="AZ">Arizona</option>
          </select>
        </div>

        {/* ZIP Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('zip')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.location.zip}
            onChange={(e) => updateLocationField('zip', e.target.value)}
            placeholder={t('zipPlaceholder')}
            pattern="[0-9]{5}(-[0-9]{4})?"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chinese-red-500 focus:border-transparent transition-all"
            required
          />
        </div>
      </div>

      {/* Location Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-800 mb-2">
          {t('locationTips')}
        </h4>
        <ul className="text-yellow-700 text-sm space-y-1">
          <li>• {t('tip1')}</li>
          <li>• {t('tip2')}</li>
          <li>• {t('tip3')}</li>
        </ul>
      </div>

      {/* Address Preview */}
      {data.location.addressLines[0] && data.location.city && data.location.zip && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-2">
            {t('addressPreview')}
          </h4>
          <div className="text-gray-700">
            {data.location.addressLines.filter(line => line.trim()).map((line, index) => (
              <div key={index}>{line}</div>
            ))}
            <div>{data.location.city}, {data.location.state} {data.location.zip}</div>
          </div>
        </div>
      )}
    </div>
  );
}