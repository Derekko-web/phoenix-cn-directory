import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { businessApi } from '@/lib/api';
import { BusinessHeader } from '@/components/BusinessHeader';
import { BusinessInfo } from '@/components/BusinessInfo';
import { BusinessPhotos } from '@/components/BusinessPhotos';
import { BusinessReviews } from '@/components/BusinessReviews';
import { BusinessHours } from '@/components/BusinessHours';
import { BusinessContact } from '@/components/BusinessContact';
import { BusinessActions } from '@/components/BusinessActions';

interface BusinessPageProps {
  params: Promise<{
    locale: 'en' | 'zh';
    slug: string;
  }>;
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const { locale, slug } = await params;
  
  try {
    const business = await businessApi.getBusiness(slug, locale);
    const t = await getTranslations('business');
    
    // Get localized content
    const localizedContent = business.localized.find(l => l.lang === locale) || business.localized[0];
    if (!localizedContent) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-chinese-red-50/30 via-white to-chinese-gold-50/30">
        {/* Enhanced Business Header with Hero Image */}
        <div className="relative overflow-hidden">
          {/* Hero Background */}
          <div className="absolute inset-0 chinese-pattern opacity-10" />
          
          <BusinessHeader 
            business={business}
            localized={localizedContent}
            locale={locale}
          />
        </div>

        {/* Bento Box Layout */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 -mt-12 z-10">
          {/* Floating Cards Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            {/* Main Business Info Card - Spans wider */}
            <div className="lg:col-span-8 order-2 lg:order-1">
              <div className="bento-card bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6">
                <BusinessInfo 
                  business={business}
                  localized={localizedContent}
                  locale={locale}
                />
              </div>
            </div>

            {/* Contact & Hours Sidebar */}
            <div className="lg:col-span-4 space-y-4 sm:space-y-6 order-1 lg:order-2">
              {/* Contact Info Bento Box */}
              {business.contact && (
                <div className="bento-card bg-gradient-to-br from-chinese-red-50 to-chinese-red-100/50 backdrop-blur-sm rounded-2xl shadow-lg border border-chinese-red-200/30 p-4 sm:p-6">
                  <BusinessContact 
                    contact={business.contact}
                    location={business.location}
                    locale={locale}
                  />
                </div>
              )}

              {/* Business Hours Bento Box */}
              {business.hours && business.hours.length > 0 && (
                <div className="bento-card bg-gradient-to-br from-chinese-gold-50 to-chinese-gold-100/50 backdrop-blur-sm rounded-2xl shadow-lg border border-chinese-gold-200/30 p-4 sm:p-6">
                  <BusinessHours 
                    hours={business.hours}
                    locale={locale}
                  />
                </div>
              )}

              {/* Action Buttons Bento Box */}
              <div className="bento-card bg-gradient-to-br from-chinese-jade-50 to-chinese-jade-100/50 backdrop-blur-sm rounded-2xl shadow-lg border border-chinese-jade-200/30 p-4 sm:p-6">
                <BusinessActions 
                  business={business}
                  locale={locale}
                />
              </div>
            </div>

            {/* Photos Gallery - Full Width Bento Box */}
            {business.photos && business.photos.length > 0 && (
              <div className="lg:col-span-12 order-3">
                <div className="bento-card bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6">
                  <BusinessPhotos 
                    photos={business.photos}
                    businessName={localizedContent.name}
                  />
                </div>
              </div>
            )}

            {/* Reviews Section - Full Width */}
            <div className="lg:col-span-12 order-4">
              <div className="bento-card bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6">
                <BusinessReviews 
                  businessId={business.id}
                  reviews={business.reviews || []}
                  locale={locale}
                />
              </div>
            </div>
          </div>

          {/* Enhanced Floating Action Button for Mobile */}
          <div className="fixed bottom-6 right-4 sm:right-6 lg:hidden z-50">
            <div className="btn-magnetic bg-gradient-to-r from-chinese-gold-500 to-chinese-gold-600 text-white p-4 rounded-full shadow-2xl hover:shadow-chinese-gold border border-chinese-gold-300/30">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    
    notFound();
  }
}

// SEO metadata
export async function generateMetadata({ params }: BusinessPageProps) {
  const { locale, slug } = await params;
  
  try {
    const business = await businessApi.getBusiness(slug, locale);
    const localizedContent = business.localized.find(l => l.lang === locale) || business.localized[0];
    
    if (!localizedContent) {
      return {
        title: 'Business Not Found',
      };
    }

    return {
      title: `${localizedContent.name} | Phoenix Chinese Directory`,
      description: localizedContent.description || `Find ${localizedContent.name} in Phoenix Chinese Directory`,
      alternates: {
        canonical: `/${locale}/business/${slug}`,
        languages: {
          'en': `/en/business/${slug}`,
          'zh': `/zh/business/${slug}`,
        },
      },
      openGraph: {
        title: localizedContent.name,
        description: localizedContent.description,
        type: 'website',
        images: business.photos?.slice(0, 1).map(photo => ({
          url: photo.url,
          alt: photo.caption || localizedContent.name,
        })) || [],
      },
    };
  } catch (error) {
    return {
      title: 'Business Not Found',
    };
  }
}