'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ClockIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

import type { StepProps, BusinessHoursSubmission } from '@/types/submission';

const DAYS_OF_WEEK = {
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  zh: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
};

const TIME_OPTIONS = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
  '22:00', '22:30', '23:00', '23:30'
];

export function HoursStep({ data, onUpdate, locale }: StepProps) {
  const t = useTranslations('submitBusiness.steps.hours');
  const [showAddHours, setShowAddHours] = useState(false);

  const initializeDefaultHours = () => {
    const defaultHours: BusinessHoursSubmission[] = [
      { dayOfWeek: 1, openTime: '09:00', closeTime: '17:00', is24h: false, isClosed: false }, // Monday
      { dayOfWeek: 2, openTime: '09:00', closeTime: '17:00', is24h: false, isClosed: false }, // Tuesday
      { dayOfWeek: 3, openTime: '09:00', closeTime: '17:00', is24h: false, isClosed: false }, // Wednesday
      { dayOfWeek: 4, openTime: '09:00', closeTime: '17:00', is24h: false, isClosed: false }, // Thursday
      { dayOfWeek: 5, openTime: '09:00', closeTime: '17:00', is24h: false, isClosed: false }, // Friday
      { dayOfWeek: 6, openTime: '10:00', closeTime: '15:00', is24h: false, isClosed: false }, // Saturday
      { dayOfWeek: 0, openTime: '', closeTime: '', is24h: false, isClosed: true }, // Sunday (closed)
    ];
    onUpdate({ hours: defaultHours });
  };

  const updateHours = (dayOfWeek: number, updates: Partial<BusinessHoursSubmission>) => {
    const updatedHours = data.hours.map(hour => 
      hour.dayOfWeek === dayOfWeek ? { ...hour, ...updates } : hour
    );
    onUpdate({ hours: updatedHours });
  };

  const addHoursForDay = (dayOfWeek: number) => {
    const newHour: BusinessHoursSubmission = {
      dayOfWeek,
      openTime: '09:00',
      closeTime: '17:00',
      is24h: false,
      isClosed: false
    };
    onUpdate({ hours: [...data.hours, newHour] });
  };

  const removeHoursForDay = (dayOfWeek: number) => {
    const updatedHours = data.hours.filter(hour => hour.dayOfWeek !== dayOfWeek);
    onUpdate({ hours: updatedHours });
  };

  const copyFromPreviousDay = (targetDay: number) => {
    const previousDay = targetDay === 0 ? 6 : targetDay - 1;
    const previousHours = data.hours.find(h => h.dayOfWeek === previousDay);
    
    if (previousHours && !previousHours.isClosed) {
      const existingHoursIndex = data.hours.findIndex(h => h.dayOfWeek === targetDay);
      const newHours = {
        dayOfWeek: targetDay,
        openTime: previousHours.openTime,
        closeTime: previousHours.closeTime,
        is24h: previousHours.is24h,
        isClosed: false
      };

      if (existingHoursIndex >= 0) {
        const updatedHours = [...data.hours];
        updatedHours[existingHoursIndex] = newHours;
        onUpdate({ hours: updatedHours });
      } else {
        onUpdate({ hours: [...data.hours, newHours] });
      }
    }
  };

  const sortedHours = [...data.hours].sort((a, b) => a.dayOfWeek - b.dayOfWeek);
  const daysWithHours = new Set(data.hours.map(h => h.dayOfWeek));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <ClockIcon className="h-12 w-12 text-chinese-red-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('title')}
        </h2>
        <p className="text-gray-600">
          {t('description')}
        </p>
      </div>

      {/* Quick Setup Options */}
      {data.hours.length === 0 && (
        <div className="text-center space-y-4">
          <button
            type="button"
            onClick={initializeDefaultHours}
            className="px-6 py-3 bg-chinese-red-600 text-white rounded-lg hover:bg-chinese-red-700 transition-colors"
          >
            {t('useTypicalHours')}
          </button>
          <p className="text-sm text-gray-500">
            {t('typicalHoursDescription')}
          </p>
        </div>
      )}

      {/* Hours Configuration */}
      {data.hours.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('businessHours')}
            </h3>
            <button
              type="button"
              onClick={() => onUpdate({ hours: [] })}
              className="text-sm text-red-600 hover:text-red-700 transition-colors"
            >
              {t('clearAllHours')}
            </button>
          </div>

          {/* Days with Hours */}
          <div className="space-y-3">
            {sortedHours.map((hour) => {
              const dayName = DAYS_OF_WEEK[locale][hour.dayOfWeek];
              
              return (
                <motion.div
                  key={hour.dayOfWeek}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="w-20 text-sm font-medium text-gray-700">
                    {dayName}
                  </div>
                  
                  {hour.isClosed ? (
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-gray-500">{t('closed')}</span>
                      <button
                        type="button"
                        onClick={() => updateHours(hour.dayOfWeek, { isClosed: false, openTime: '09:00', closeTime: '17:00' })}
                        className="text-sm text-chinese-red-600 hover:text-chinese-red-700 transition-colors"
                      >
                        {t('addHours')}
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* 24h Toggle */}
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={hour.is24h}
                          onChange={(e) => updateHours(hour.dayOfWeek, { is24h: e.target.checked })}
                          className="h-4 w-4 text-chinese-red-600 focus:ring-chinese-red-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {t('24hours')}
                        </span>
                      </label>

                      {!hour.is24h && (
                        <>
                          {/* Open Time */}
                          <select
                            value={hour.openTime}
                            onChange={(e) => updateHours(hour.dayOfWeek, { openTime: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chinese-red-500 focus:border-transparent"
                          >
                            {TIME_OPTIONS.map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>

                          <span className="text-gray-500">-</span>

                          {/* Close Time */}
                          <select
                            value={hour.closeTime}
                            onChange={(e) => updateHours(hour.dayOfWeek, { closeTime: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chinese-red-500 focus:border-transparent"
                          >
                            {TIME_OPTIONS.map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                        </>
                      )}

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => updateHours(hour.dayOfWeek, { isClosed: true })}
                          className="text-sm text-gray-600 hover:text-gray-700 transition-colors"
                        >
                          {t('setClosed')}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeHoursForDay(hour.dayOfWeek)}
                          className="p-1 text-red-600 hover:text-red-700 transition-colors"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Add Missing Days */}
          {daysWithHours.size < 7 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                {t('addMoreDays')}:
              </h4>
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_WEEK[locale].map((dayName, index) => {
                  if (daysWithHours.has(index)) return null;
                  
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => addHoursForDay(index)}
                      className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {dayName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Business Hours Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">
          {t('hoursTips')}
        </h4>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• {t('tip1')}</li>
          <li>• {t('tip2')}</li>
          <li>• {t('tip3')}</li>
          <li>• {t('tip4')}</li>
        </ul>
      </div>

      {/* Skip Notice */}
      <div className="text-center text-gray-500 text-sm">
        {t('skipNotice')}
      </div>
    </div>
  );
}