'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { businessApi, type Business } from '@/lib/api';
import { BusinessCard } from './BusinessCard';

interface BusinessGridProps {
  locale: 'en' | 'zh';
  searchParams?: {
    category?: string;
    search?: string;
    city?: string;
    page?: string;
  };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export function BusinessGrid({ locale, searchParams }: BusinessGridProps) {
  const t = useTranslations('businesses');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  
  const currentPage = parseInt(searchParams?.page || '1');
  const itemsPerPage = 12;
  const offset = (currentPage - 1) * itemsPerPage;

  useEffect(() => {
    async function fetchBusinesses() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await businessApi.getBusinesses({
          status: 'approved',
          category: searchParams?.category,
          search: searchParams?.search,
          city: searchParams?.city,
          locale,
          limit: itemsPerPage,
          offset,
        });
        
        setBusinesses(response.businesses);
        setTotal(response.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load businesses');
        setBusinesses([]);
      } finally {
        setLoading(false);
      }
    }

    fetchBusinesses();
  }, [locale, searchParams?.category, searchParams?.search, searchParams?.city, offset]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {[...Array(itemsPerPage)].map((_, i) => (
          <div 
            key={i} 
            className="h-80 bg-white rounded-xl shadow-sm animate-pulse skeleton business-card"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg mb-4">
          {t('errorLoading')}
        </div>
        <p className="text-gray-600">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-chinese-red-600 text-white rounded-lg hover:bg-chinese-red-700 transition-colors"
        >
          {t('retry')}
        </button>
      </div>
    );
  }

  if (businesses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {t('noResults')}
        </h3>
        <p className="text-gray-600 mb-6">
          {t('noResultsDescription')}
        </p>
        <Link
          href={`/${locale}/businesses`}
          className="inline-flex items-center px-6 py-3 bg-chinese-red-600 text-white rounded-lg hover:bg-chinese-red-700 transition-colors"
        >
          {t('viewAll')}
        </Link>
      </div>
    );
  }

  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <div>
      {/* Results Summary */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-gray-600">
          {t('resultsCount', { 
            start: offset + 1, 
            end: Math.min(offset + itemsPerPage, total), 
            total 
          })}
        </div>
      </div>

      {/* Business Cards Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {businesses.map((business) => (
          <BusinessCard
            key={business.id}
            business={business}
            locale={locale}
          />
        ))}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            {/* Previous Button */}
            {currentPage > 1 && (
              <Link
                href={{
                  pathname: `/${locale}/businesses`,
                  query: { ...searchParams, page: (currentPage - 1).toString() }
                }}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {t('previous')}
              </Link>
            )}

            {/* Page Numbers */}
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              const isCurrentPage = page === currentPage;
              
              // Show first, last, current, and adjacent pages
              if (
                page === 1 ||
                page === totalPages ||
                Math.abs(page - currentPage) <= 1
              ) {
                return (
                  <Link
                    key={page}
                    href={{
                      pathname: `/${locale}/businesses`,
                      query: { ...searchParams, page: page.toString() }
                    }}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      isCurrentPage
                        ? 'bg-chinese-red-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </Link>
                );
              } else if (
                (page === currentPage - 2 && currentPage > 3) ||
                (page === currentPage + 2 && currentPage < totalPages - 2)
              ) {
                return <span key={page} className="px-2 text-gray-400">...</span>;
              }
              
              return null;
            })}

            {/* Next Button */}
            {currentPage < totalPages && (
              <Link
                href={{
                  pathname: `/${locale}/businesses`,
                  query: { ...searchParams, page: (currentPage + 1).toString() }
                }}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {t('next')}
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}