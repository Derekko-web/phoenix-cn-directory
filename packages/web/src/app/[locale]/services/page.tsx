'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function ServicesPage() {
  const t = useTranslations();
  const currentLocale = useLocale();

  const serviceCategories = [
    {
      key: 'legal',
      titleEn: 'Legal Services',
      titleZh: '法律服务',
      descEn: 'Immigration, business law, real estate attorneys',
      descZh: '移民、商业法律、房地产律师',
      icon: '⚖️',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      key: 'accounting',
      titleEn: 'Accounting & Tax',
      titleZh: '会计税务',
      descEn: 'Tax preparation, bookkeeping, business consulting',
      descZh: '税务准备、记账、商业咨询',
      icon: '📊',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      key: 'realestate',
      titleEn: 'Real Estate',
      titleZh: '房地产',
      descEn: 'Buy, sell, rent properties with Chinese-speaking agents',
      descZh: '买卖租赁房产，提供中文服务',
      icon: '🏠',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      key: 'insurance',
      titleEn: 'Insurance',
      titleZh: '保险服务',
      descEn: 'Auto, home, life, and business insurance',
      descZh: '汽车、房屋、生命和商业保险',
      icon: '🛡️',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      key: 'financial',
      titleEn: 'Financial Services',
      titleZh: '金融服务',
      descEn: 'Banking, loans, investment advisory',
      descZh: '银行业务、贷款、投资咨询',
      icon: '💰',
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      key: 'tech',
      titleEn: 'Technology',
      titleZh: '科技服务',
      descEn: 'IT support, web development, consulting',
      descZh: 'IT支持、网站开发、技术咨询',
      icon: '💻',
      gradient: 'from-cyan-500 to-blue-600'
    }
  ];

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-chinese">
            <span className="bg-gradient-to-r from-chinese-red-600 via-chinese-gold-600 to-chinese-jade-600 bg-clip-text text-transparent">
              {currentLocale === 'zh' ? '专业服务' : 'Professional Services'}
            </span>
          </h1>
          <p className="text-xl text-chinese-ink-600 max-w-3xl mx-auto leading-relaxed">
            {currentLocale === 'zh' 
              ? '凤凰城华人社区的专业服务提供商，提供中文服务' 
              : 'Professional service providers in the Phoenix Chinese community offering bilingual expertise'
            }
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {serviceCategories.map((category, index) => (
            <motion.div
              key={category.key}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Link href={`/${currentLocale}/businesses?category=${category.key}` as any}>
                <div className="relative glass rounded-2xl p-8 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                  
                  <div className="relative z-10">
                    <div className="text-6xl mb-4 text-center">
                      {category.icon}
                    </div>
                    
                    <h3 className="text-xl font-bold text-chinese-ink-800 mb-3 text-center">
                      {currentLocale === 'zh' ? category.titleZh : category.titleEn}
                    </h3>
                    
                    <p className="text-chinese-ink-600 text-center leading-relaxed">
                      {currentLocale === 'zh' ? category.descZh : category.descEn}
                    </p>

                    <div className="flex justify-center mt-4">
                      <motion.div
                        className={`bg-gradient-to-r ${category.gradient} text-white px-4 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                        initial={{ scale: 0.8 }}
                        whileHover={{ scale: 1 }}
                      >
                        {currentLocale === 'zh' ? '查看服务商' : 'View Providers'}
                      </motion.div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="glass rounded-2xl p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-chinese-ink-800 mb-4">
              {currentLocale === 'zh' ? '是专业服务提供商？' : 'Are you a service provider?'}
            </h2>
            <p className="text-chinese-ink-600 mb-6 leading-relaxed">
              {currentLocale === 'zh' 
                ? '加入我们的专业服务目录，为凤凰城华人社区提供服务' 
                : 'Join our professional services directory and serve the Phoenix Chinese community'
              }
            </p>
            <Link href={`/${currentLocale}/submit-business` as any}>
              <motion.div
                className="inline-flex items-center gap-3 bg-gradient-to-r from-chinese-red-500 to-chinese-gold-500 text-white px-8 py-4 rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>
                  {currentLocale === 'zh' ? '添加您的服务' : 'List Your Services'}
                </span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}