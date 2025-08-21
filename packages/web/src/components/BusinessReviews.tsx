'use client';

import { useTranslations } from 'next-intl';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { type Review } from '@/lib/api';

interface BusinessReviewsProps {
  businessId: string;
  reviews: Review[];
  locale: 'en' | 'zh';
}

export function BusinessReviews({ businessId, reviews, locale }: BusinessReviewsProps) {
  const t = useTranslations('reviews');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Reviews ({reviews.length})
        </h2>
        
        <button className="px-4 py-2 bg-chinese-red-600 text-white rounded-lg hover:bg-chinese-red-700 transition-colors">
          Write Review
        </button>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">No reviews yet</p>
          <p>Be the first to review this business!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        i < review.rating ? (
                          <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
                        ) : (
                          <StarOutlineIcon key={i} className="h-4 w-4 text-gray-300" />
                        )
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {review.rating}/5
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    by {review.user.email.split('@')[0]} • {formatDate(review.createdAt)}
                  </div>
                </div>
              </div>

              {review.title && (
                <h3 className="font-semibold text-gray-900 mb-2">
                  {review.title}
                </h3>
              )}

              {review.body && (
                <p className="text-gray-700">
                  {review.body}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}