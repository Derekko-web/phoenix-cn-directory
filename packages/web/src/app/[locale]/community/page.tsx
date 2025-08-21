'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function CommunityPage() {
  const t = useTranslations();
  const currentLocale = useLocale();
  const { isAuthenticated } = useAuth();

  const communityFeatures = [
    {
      key: 'events',
      titleEn: 'Community Events',
      titleZh: '社区活动',
      descEn: 'Chinese New Year, Mid-Autumn Festival, cultural celebrations',
      descZh: '春节、中秋节、文化庆典活动',
      icon: '🎉',
      gradient: 'from-red-500 to-pink-600',
      comingSoon: false
    },
    {
      key: 'news',
      titleEn: 'Community News',
      titleZh: '社区新闻',
      descEn: 'Latest updates and announcements from the Chinese community',
      descZh: '华人社区最新动态和公告',
      icon: '📰',
      gradient: 'from-blue-500 to-indigo-600',
      comingSoon: true
    },
    {
      key: 'resources',
      titleEn: 'Community Resources',
      titleZh: '社区资源',
      descEn: 'Language classes, cultural centers, support groups',
      descZh: '语言班、文化中心、互助小组',
      icon: '📚',
      gradient: 'from-green-500 to-emerald-600',
      comingSoon: false
    },
    {
      key: 'culture',
      titleEn: 'Cultural Heritage',
      titleZh: '文化传承',
      descEn: 'Traditional arts, music, dance, and cultural education',
      descZh: '传统艺术、音乐、舞蹈和文化教育',
      icon: '🏮',
      gradient: 'from-yellow-500 to-orange-600',
      comingSoon: true
    },
    {
      key: 'support',
      titleEn: 'Community Support',
      titleZh: '社区互助',
      descEn: 'Job boards, housing help, newcomer assistance',
      descZh: '招聘信息、住房帮助、新移民协助',
      icon: '🤝',
      gradient: 'from-purple-500 to-pink-600',
      comingSoon: true
    },
    {
      key: 'youth',
      titleEn: 'Youth Programs',
      titleZh: '青少年项目',
      descEn: 'Educational programs, summer camps, youth activities',
      descZh: '教育项目、夏令营、青少年活动',
      icon: '🎓',
      gradient: 'from-cyan-500 to-blue-600',
      comingSoon: true
    }
  ];

  const upcomingEvents = [
    {
      titleEn: 'Phoenix Chinese Cultural Festival',
      titleZh: '凤凰城中华文化节',
      date: '2025-02-15',
      location: 'Steele Indian School Park',
      descEn: 'Annual celebration featuring traditional performances, food, and cultural exhibits',
      descZh: '年度庆典，包括传统表演、美食和文化展览'
    },
    {
      titleEn: 'Chinese New Year Gala',
      titleZh: '春节联欢晚会',
      date: '2025-01-25',
      location: 'Phoenix Convention Center',
      descEn: 'Grand celebration with lion dance, cultural performances, and community dinner',
      descZh: '盛大庆典，包括舞狮、文化表演和社区晚宴'
    },
    {
      titleEn: 'Mandarin Story Time',
      titleZh: '中文故事时间',
      date: 'Weekly Saturdays',
      location: 'Phoenix Public Library',
      descEn: 'Weekly reading sessions for children in Mandarin and English',
      descZh: '每周为儿童举办的中英文阅读活动'
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
              {currentLocale === 'zh' ? '华人社区' : 'Chinese Community'}
            </span>
          </h1>
          <p className="text-xl text-chinese-ink-600 max-w-3xl mx-auto leading-relaxed">
            {currentLocale === 'zh' 
              ? '连接凤凰城华人社区，分享文化、活动和资源' 
              : 'Connecting the Phoenix Chinese community through culture, events, and resources'
            }
          </p>
        </motion.div>

        {/* Community Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {communityFeatures.map((feature, index) => (
            <motion.div
              key={feature.key}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <div className={`relative glass rounded-2xl p-8 transition-all duration-300 ${!feature.comingSoon ? 'hover:shadow-xl group-hover:scale-105 cursor-pointer' : 'opacity-75'}`}>
                {feature.comingSoon && (
                  <div className="absolute top-4 right-4 bg-chinese-gold-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    {currentLocale === 'zh' ? '敬请期待' : 'Coming Soon'}
                  </div>
                )}
                
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 ${!feature.comingSoon ? 'group-hover:opacity-10' : ''} rounded-2xl transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  <div className="text-6xl mb-4 text-center">
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-chinese-ink-800 mb-3 text-center">
                    {currentLocale === 'zh' ? feature.titleZh : feature.titleEn}
                  </h3>
                  
                  <p className="text-chinese-ink-600 text-center leading-relaxed">
                    {currentLocale === 'zh' ? feature.descZh : feature.descEn}
                  </p>

                  {!feature.comingSoon && (
                    <div className="flex justify-center mt-4">
                      <motion.div
                        className={`bg-gradient-to-r ${feature.gradient} text-white px-4 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                        initial={{ scale: 0.8 }}
                        whileHover={{ scale: 1 }}
                      >
                        {currentLocale === 'zh' ? '了解更多' : 'Learn More'}
                      </motion.div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Upcoming Events Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-chinese-ink-800 mb-8 text-center">
            {currentLocale === 'zh' ? '即将举行的活动' : 'Upcoming Events'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={index}
                className="glass rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <div className="text-chinese-red-600 text-sm font-medium mb-2">
                  {event.date} • {event.location}
                </div>
                <h3 className="text-lg font-bold text-chinese-ink-800 mb-2">
                  {currentLocale === 'zh' ? event.titleZh : event.titleEn}
                </h3>
                <p className="text-chinese-ink-600 text-sm leading-relaxed">
                  {currentLocale === 'zh' ? event.descZh : event.descEn}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="glass rounded-2xl p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-chinese-ink-800 mb-4">
              {currentLocale === 'zh' ? '加入我们的社区' : 'Join Our Community'}
            </h2>
            <p className="text-chinese-ink-600 mb-6 leading-relaxed">
              {currentLocale === 'zh' 
                ? '成为凤凰城华人目录的一部分，与社区保持联系，获取最新资讯' 
                : 'Be part of the Phoenix Chinese Directory community and stay connected with the latest news and events'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <Link href={`/${currentLocale}/register` as any}>
                  <motion.div
                    className="bg-gradient-to-r from-chinese-red-500 to-chinese-gold-500 text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {currentLocale === 'zh' ? '注册账户' : 'Create Account'}
                  </motion.div>
                </Link>
              ) : (
                <Link href={`/${currentLocale}/dashboard` as any}>
                  <motion.div
                    className="bg-gradient-to-r from-chinese-red-500 to-chinese-gold-500 text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {currentLocale === 'zh' ? '访问仪表板' : 'Go to Dashboard'}
                  </motion.div>
                </Link>
              )}
              <Link href={`/${currentLocale}/submit-business` as any}>
                <motion.div
                  className="border-2 border-chinese-red-500 text-chinese-red-600 px-8 py-4 rounded-xl font-medium hover:bg-chinese-red-50 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {currentLocale === 'zh' ? '添加活动或资源' : 'Add Event or Resource'}
                </motion.div>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}