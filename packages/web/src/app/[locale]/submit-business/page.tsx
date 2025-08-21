import { getTranslations } from 'next-intl/server';
import { BusinessSubmissionForm } from '@/components/BusinessSubmissionForm';

interface SubmitBusinessPageProps {
  params: {
    locale: 'en' | 'zh';
  };
}

export default async function SubmitBusinessPage({ params }: SubmitBusinessPageProps) {
  const t = await getTranslations('submitBusiness');
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-chinese-red-600 to-chinese-gold-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-chinese mb-6">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <BusinessSubmissionForm locale={params.locale} />
        </div>
      </section>
    </div>
  );
}

// SEO metadata
export async function generateMetadata({ params }: { params: { locale: 'en' | 'zh' } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'submitBusiness' });
  
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: `/${params.locale}/submit-business`,
      languages: {
        'en': '/en/submit-business',
        'zh': '/zh/submit-business',
      },
    },
  };
}