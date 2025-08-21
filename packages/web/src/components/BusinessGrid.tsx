'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { businessApi, type Business } from '@/lib/api';
import { BusinessCard } from './BusinessCard';
import { BusinessListItem } from './BusinessListItem';
import { BusinessResultsHeader } from './BusinessResultsHeader';

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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const currentPage = parseInt(searchParams?.page || '1');
  const itemsPerPage = viewMode === 'list' ? 8 : 12; // Fewer items for list view
  const offset = (currentPage - 1) * itemsPerPage;

  useEffect(() => {
    async function fetchBusinesses() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await businessApi.getBusinesses({
          category: searchParams?.category,
          search: searchParams?.search,
          city: searchParams?.city,
          sort: searchParams?.sort,
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
  }, [locale, searchParams?.category, searchParams?.search, searchParams?.city, searchParams?.sort, offset, itemsPerPage]);

  const renderLoadingSkeleton = () => {
    if (viewMode === 'list') {
      return (
        <div className="space-y-4">
          {[...Array(itemsPerPage)].map((_, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              {/* List Loading Skeleton */}
              <div className="p-6 flex space-x-4">
                {/* Image Skeleton */}
                <div className="w-32 h-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse"></div>
                
                {/* Content Skeleton */}
                <div className="flex-1 space-y-3">
                  {/* Title */}
                  <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse"></div>
                  
                  {/* Categories */}
                  <div className="flex space-x-2">
                    <div className="h-5 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-5 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-pulse"></div>
                  </div>
                  
                  {/* Description */}
                  <div className="space-y-2">
                    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-3/4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                
                {/* Status Skeleton */}
                <div className="flex flex-col items-end space-y-2">
                  <div className="h-6 w-20 bg-gradient-to-r from-green-200 via-green-300 to-green-200 rounded-full animate-pulse"></div>
                  <div className="h-4 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      );
    } else {
      return (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[...Array(itemsPerPage)].map((_, i) => (
            <motion.div 
              key={i} 
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  transition: { duration: 0.5, ease: "easeOut" }
                }
              }}
              className="bg-white rounded-xl shadow-sm overflow-hidden business-card"
            >
              {/* Card Loading Skeleton */}
              <div className="relative">
                {/* Image Skeleton */}
                <div className="h-48 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 animate-pulse relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[skeleton-shimmer_2s_ease-in-out_infinite]"></div>
                </div>
                
                {/* Status Badge Skeleton */}
                <div className="absolute top-3 right-3 h-6 w-20 bg-gradient-to-r from-green-200 via-green-300 to-green-200 rounded-full animate-pulse"></div>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Title Skeleton */}
                <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse"></div>
                
                {/* Categories Skeleton */}
                <div className="flex flex-wrap gap-2">
                  <div className="h-5 w-16 bg-gradient-to-r from-chinese-red-200 via-chinese-red-300 to-chinese-red-200 rounded-full animate-pulse"></div>
                  <div className="h-5 w-20 bg-gradient-to-r from-chinese-gold-200 via-chinese-gold-300 to-chinese-gold-200 rounded-full animate-pulse"></div>
                </div>
                
                {/* Description Skeleton */}
                <div className="space-y-2">
                  <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-4/5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-3/5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse"></div>
                </div>
                
                {/* Hours and Contact Skeleton */}
                <div className="flex justify-between items-center pt-2">
                  <div className="h-5 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse"></div>
                  <div className="h-8 w-28 bg-gradient-to-r from-chinese-red-200 via-chinese-red-300 to-chinese-red-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      );
    }
  };

  if (loading) {
    return renderLoadingSkeleton();
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

  const renderBusinesses = () => {
    if (viewMode === 'list') {
      return (
        <motion.div
          className="space-y-4 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {businesses.map((business) => (
            <BusinessListItem
              key={business.id}
              business={business}
              locale={locale}
            />
          ))}
        </motion.div>
      );
    } else {
      return (
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
      );
    }
  };

  return (
    <div>
      {/* Results Header with Controls */}
      <BusinessResultsHeader
        locale={locale}
        total={total}
        offset={offset}
        itemsPerPage={itemsPerPage}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Business Cards/List */}
      {renderBusinesses()}

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