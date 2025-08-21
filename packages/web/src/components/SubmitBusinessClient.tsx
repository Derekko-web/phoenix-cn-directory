'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { BusinessSubmissionForm } from '@/components/BusinessSubmissionForm';
import { CheckIcon, UserGroupIcon, ChartBarIcon, StarIcon } from '@heroicons/react/24/outline';

interface SubmitBusinessClientProps {
  locale: 'en' | 'zh';
}

export function SubmitBusinessClient({ locale }: SubmitBusinessClientProps) {
  const t = useTranslations('submitBusiness');
  const currentLocale = useLocale();
  
  const benefits = [
    {
      icon: ChartBarIcon,
      titleKey: 'hero.benefits.visibility',
      color: 'from-chinese-red-500 to-chinese-red-600'
    },
    {
      icon: UserGroupIcon, 
      titleKey: 'hero.benefits.customers',
      color: 'from-chinese-gold-500 to-chinese-gold-600'
    },
    {
      icon: StarIcon,
      titleKey: 'hero.benefits.community', 
      color: 'from-chinese-jade-500 to-chinese-jade-600'
    }
  ];

  const features = [
    {
      titleKey: 'features.free.title',
      descKey: 'features.free.description'
    },
    {
      titleKey: 'features.setup.title',
      descKey: 'features.setup.description'
    },
    {
      titleKey: 'features.bilingual.title',
      descKey: 'features.bilingual.description'
    },
    {
      titleKey: 'features.mobile.title',
      descKey: 'features.mobile.description'
    }
  ];

  return (
    <>
      {/* Enhanced Hero Section */}
      <section className="relative pt-24 pb-16">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-chinese-red-500/5 via-chinese-gold-500/5 to-chinese-jade-500/5" />
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <motion.div
              className="text-center lg:text-left"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 font-chinese">
                <span className="bg-gradient-to-r from-chinese-red-600 via-chinese-gold-600 to-chinese-jade-600 bg-clip-text text-transparent">
                  {t('hero.title')}
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-chinese-ink-600 mb-8 leading-relaxed">
                {t('hero.subtitle')}
              </p>
              
              {/* Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <motion.div
                      key={benefit.titleKey}
                      className="flex items-center gap-3 glass rounded-lg p-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                    >
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${benefit.color} flex items-center justify-center text-white`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-chinese-ink-700 font-medium text-sm">
                        {t(benefit.titleKey as any)}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <a href="#form" className="inline-flex items-center gap-3 bg-gradient-to-r from-chinese-red-500 to-chinese-gold-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  {t('cta.getStarted')}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </motion.div>
            </motion.div>

            {/* Right Column - Features Grid */}
            <motion.div
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="glass rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-chinese-red-500 to-chinese-gold-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                    <CheckIcon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-chinese-ink-800 mb-2">
                    {t(feature.titleKey as any)}
                  </h3>
                  <p className="text-sm text-chinese-ink-600">
                    {t(feature.descKey as any)}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="form" className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-chinese-ink-800 mb-4">
              {t('cta.letsStart')}
            </h2>
            <p className="text-chinese-ink-600 max-w-2xl mx-auto">
              {t('cta.letsStartDescription')}
            </p>
          </motion.div>
          
          <motion.div
            className="glass rounded-3xl p-8 md:p-12 shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <BusinessSubmissionForm locale={locale} />
          </motion.div>
        </div>
      </section>
      
      {/* Trust Section */}
      <section className="py-16 bg-gradient-to-r from-chinese-red-50 to-chinese-gold-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-chinese-ink-800 mb-4">
              {t('community.title')}
            </h3>
            <p className="text-chinese-ink-600 mb-8 max-w-2xl mx-auto">
              {t('community.description')}
            </p>
            <div className="flex items-center justify-center gap-8 text-chinese-ink-500">
              <div className="text-center">
                <div className="text-3xl font-bold text-chinese-red-600">500+</div>
                <div className="text-sm">{t('community.stats.businesses')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-chinese-gold-600">10K+</div>
                <div className="text-sm">{t('community.stats.visitors')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-chinese-jade-600">24/7</div>
                <div className="text-sm">{t('community.stats.visibility')}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}