'use client';

import { useTranslations } from 'next-intl';
import { ClockIcon } from '@heroicons/react/24/outline';
import { type BusinessHours as BusinessHoursType } from '@/lib/api';

interface BusinessHoursProps {
  hours: BusinessHoursType[];
  locale: 'en' | 'zh';
}

const DAYS_OF_WEEK = {
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  zh: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
};

export function BusinessHours({ hours, locale }: BusinessHoursProps) {
  const t = useTranslations('hours');
  
  const formatTime = (time: string) => {
    return time; // For now, assume times are already formatted
  };

  const sortedHours = [...hours].sort((a, b) => a.dayOfWeek - b.dayOfWeek);
  const today = new Date().getDay();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <ClockIcon className="h-5 w-5 mr-2 text-gray-500" />
        Business Hours
      </h3>

      <div className="space-y-2">
        {sortedHours.map((dayHours) => {
          const isToday = dayHours.dayOfWeek === today;
          const dayName = DAYS_OF_WEEK[locale][dayHours.dayOfWeek];

          return (
            <div 
              key={dayHours.dayOfWeek}
              className={`flex justify-between items-center py-2 px-3 rounded-lg ${
                isToday ? 'bg-chinese-red-50 border border-chinese-red-200' : 'hover:bg-gray-50'
              }`}
            >
              <span className={`font-medium ${
                isToday ? 'text-chinese-red-700' : 'text-gray-700'
              }`}>
                {dayName}
              </span>
              
              <span className={`text-sm ${
                isToday ? 'text-chinese-red-600 font-medium' : 'text-gray-600'
              }`}>
                {dayHours.is24h ? (
                  'Open 24 hours'
                ) : dayHours.openTime && dayHours.closeTime ? (
                  `${formatTime(dayHours.openTime)} - ${formatTime(dayHours.closeTime)}`
                ) : (
                  'Closed'
                )}
              </span>
            </div>
          );
        })}
      </div>

      {/* Current Status */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            Open Now
          </span>
        </div>
      </div>
    </div>
  );
}