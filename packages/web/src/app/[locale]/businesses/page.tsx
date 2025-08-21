import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { BusinessGrid } from '@/components/BusinessGrid';
import { BusinessFilters } from '@/components/BusinessFilters';
import { SearchBar } from '@/components/SearchBar';

interface BusinessesPageProps {
  params: Promise<{
    locale: 'en' | 'zh';
  }>;
  searchParams?: Promise<{
    category?: string;
    search?: string;
    city?: string;
    page?: string;
  }>;
}

export default async function BusinessesPage({ params, searchParams }: BusinessesPageProps) {
  const { locale } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const t = await getTranslations('businesses');
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-chinese-red-600 to-chinese-gold-600 text-white py-12 md:py-16 ios-safe-top">
        <div className="max-w-7xl mx-auto container">
          <div className="text-center">
            <h1 className="text-3xl md:text-6xl font-bold font-chinese mb-6">
              {t('title')}
            </h1>
            <p className="text-lg md:text-2xl text-white/90 max-w-3xl mx-auto">
              {t('subtitle')}
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="mt-8 md:mt-12 max-w-2xl mx-auto">
            <Suspense fallback={<div className="h-16 bg-white/20 rounded-xl animate-pulse skeleton" />}>
              <SearchBar 
                locale={locale} 
                initialSearch={resolvedSearchParams?.search}
              />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto container py-8 md:py-12 ios-safe-bottom">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-80">
            <Suspense fallback={<div className="h-96 bg-white rounded-xl shadow-sm animate-pulse skeleton" />}>
              <BusinessFilters 
                locale={locale}
                selectedCategory={resolvedSearchParams?.category}
                selectedCity={resolvedSearchParams?.city}
              />
            </Suspense>
          </aside>

          {/* Business Grid */}
          <main className="flex-1">
            <Suspense 
              fallback={
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div 
                      key={i} 
                      className="h-80 bg-white rounded-xl shadow-sm animate-pulse skeleton business-card"
                    />
                  ))}
                </div>
              }
            >
              <BusinessGrid 
                locale={locale}
                searchParams={resolvedSearchParams}
              />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}

// SEO metadata
export async function generateMetadata({ params }: { params: Promise<{ locale: 'en' | 'zh' }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'businesses' });
  
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: `/${locale}/businesses`,
      languages: {
        'en': '/en/businesses',
        'zh': '/zh/businesses',
      },
    },
  };
}