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
  params: {
    locale: 'en' | 'zh';
    slug: string;
  };
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const { locale, slug } = params;
  
  try {
    const business = await businessApi.getBusiness(slug, locale);
    const t = await getTranslations('business');
    
    // Get localized content
    const localizedContent = business.localized.find(l => l.lang === locale) || business.localized[0];
    if (!localizedContent) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Business Header */}
        <BusinessHeader 
          business={business}
          localized={localizedContent}
          locale={locale}
        />

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Business Info */}
              <BusinessInfo 
                business={business}
                localized={localizedContent}
                locale={locale}
              />

              {/* Photos Gallery */}
              {business.photos && business.photos.length > 0 && (
                <BusinessPhotos 
                  photos={business.photos}
                  businessName={localizedContent.name}
                />
              )}

              {/* Reviews */}
              <BusinessReviews 
                businessId={business.id}
                reviews={business.reviews || []}
                locale={locale}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              {business.contact && (
                <BusinessContact 
                  contact={business.contact}
                  location={business.location}
                  locale={locale}
                />
              )}

              {/* Business Hours */}
              {business.hours && business.hours.length > 0 && (
                <BusinessHours 
                  hours={business.hours}
                  locale={locale}
                />
              )}

              {/* Action Buttons */}
              <BusinessActions 
                business={business}
                locale={locale}
              />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching business:', error);
    notFound();
  }
}

// SEO metadata
export async function generateMetadata({ params }: BusinessPageProps) {
  const { locale, slug } = params;
  
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