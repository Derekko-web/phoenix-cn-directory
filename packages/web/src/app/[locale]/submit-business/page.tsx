import { getTranslations } from 'next-intl/server';
import { SubmitBusinessClient } from '@/components/SubmitBusinessClient';

interface SubmitBusinessPageProps {
  params: Promise<{
    locale: 'en' | 'zh';
  }>;
}

export default async function SubmitBusinessPage({ params }: SubmitBusinessPageProps) {
  const { locale } = await params;
  return (
    <div className="min-h-screen chinese-pattern overflow-hidden">
      <SubmitBusinessClient locale={locale} />
    </div>
  );
}

// SEO metadata
export async function generateMetadata({ params }: { params: Promise<{ locale: 'en' | 'zh' }> }) {
  const { locale } = await params;
  const messages = locale === 'zh' 
    ? {
        title: '提交您的商家 | 凤凰城华人目录',
        description: '将您的中式企业添加到我们的目录中，在凤凰城地区获得更多客户。'
      }
    : {
        title: 'Submit Your Business | Phoenix Chinese Directory', 
        description: 'Add your Chinese business to our directory and reach more customers in the Phoenix area.'
      };
  
  return {
    title: messages.title,
    description: messages.description,
    alternates: {
      canonical: `/${locale}/submit-business`,
      languages: {
        'en': '/en/submit-business',
        'zh': '/zh/submit-business',
      },
    },
  };
}