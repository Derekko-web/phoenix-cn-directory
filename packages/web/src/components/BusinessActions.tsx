'use client';

import { HeartIcon, BookmarkIcon, ShareIcon, FlagIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { type Business } from '@/lib/api';

interface BusinessActionsProps {
  business: Business;
  locale: 'en' | 'zh';
}

export function BusinessActions({ business, locale }: BusinessActionsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: business.localized[0]?.name || 'Business',
          text: business.localized[0]?.description || '',
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to copy to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleReport = () => {
    // This would open a report modal
    alert('Report functionality will be implemented soon');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Actions
      </h3>

      <div className="space-y-3">
        {/* Like Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`w-full flex items-center justify-center px-4 py-3 rounded-lg border transition-colors ${
            isLiked
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {isLiked ? (
            <HeartSolidIcon className="h-5 w-5 mr-2" />
          ) : (
            <HeartIcon className="h-5 w-5 mr-2" />
          )}
          {isLiked ? 'Liked' : 'Like'}
        </button>

        {/* Bookmark Button */}
        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={`w-full flex items-center justify-center px-4 py-3 rounded-lg border transition-colors ${
            isBookmarked
              ? 'bg-chinese-gold-50 border-chinese-gold-200 text-chinese-gold-700'
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {isBookmarked ? (
            <BookmarkSolidIcon className="h-5 w-5 mr-2" />
          ) : (
            <BookmarkIcon className="h-5 w-5 mr-2" />
          )}
          {isBookmarked ? 'Bookmarked' : 'Bookmark'}
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="w-full flex items-center justify-center px-4 py-3 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ShareIcon className="h-5 w-5 mr-2" />
          Share
        </button>

        {/* Report Button */}
        <button
          onClick={handleReport}
          className="w-full flex items-center justify-center px-4 py-3 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <FlagIcon className="h-5 w-5 mr-2" />
          Report
        </button>
      </div>

      {/* Owner Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-3">
          Are you the owner of this business?
        </p>
        <button className="w-full px-4 py-2 bg-chinese-red-600 text-white rounded-lg hover:bg-chinese-red-700 transition-colors">
          Claim This Business
        </button>
      </div>
    </div>
  );
}