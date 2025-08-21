'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export const Footer = () => {
  const t = useTranslations('nav');
  
  return (
    <footer className="relative mt-20 glass border-t border-white/10">
      <div className="absolute inset-0 bg-gradient-to-r from-chinese-red-500/5 via-chinese-gold-500/5 to-chinese-jade-500/5" />
      
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <motion.div 
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-chinese-red-500 to-chinese-gold-500 rounded-xl flex items-center justify-center text-white font-chinese font-bold text-2xl shadow-lg">
                凤
              </div>
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-chinese-red-600 to-chinese-gold-600 bg-clip-text text-transparent">
                  凤凰城华人目录
                </div>
                <div className="text-sm text-chinese-ink-500">
                  Phoenix Chinese Directory
                </div>
              </div>
            </motion.div>
            
            <motion.p 
              className="text-chinese-ink-600 mb-6 leading-relaxed font-chinese max-w-md"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              连接凤凰城华人社区，发现优质商家服务，分享文化活动资讯。我们致力于为在美华人提供便利的生活服务指南。
            </motion.p>

            <motion.div 
              className="flex gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              {['WeChat', 'WhatsApp', 'Email'].map((platform, index) => (
                <motion.button
                  key={platform}
                  className="glass rounded-full p-3 hover:bg-chinese-red-500/10 transition-colors duration-200"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <div className="w-5 h-5 bg-gradient-to-r from-chinese-red-500 to-chinese-gold-500 rounded-full" />
                </motion.button>
              ))}
            </motion.div>
          </div>

          {/* Quick Links */}
          <div>
            <motion.h3 
              className="font-bold text-chinese-ink-700 mb-6 font-chinese"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              快速链接
            </motion.h3>
            <div className="space-y-3">
              {[
                { label: '热门餐厅', href: '/restaurants' },
                { label: '生活服务', href: '/services' },
                { label: '社区活动', href: '/events' },
                { label: '关于我们', href: '/about' },
              ].map((link, index) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <Link 
                    href={link.href}
                    className="block text-chinese-ink-500 hover:text-chinese-red-600 transition-colors duration-200 font-chinese"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <motion.h3 
              className="font-bold text-chinese-ink-700 mb-6 font-chinese"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              联系我们
            </motion.h3>
            <div className="space-y-3">
              {[
                { icon: '📍', text: 'Phoenix, AZ' },
                { icon: '📧', text: 'hello@phoenixcn.com' },
                { icon: '💬', text: 'WeChat: PhoenixCN' },
                { icon: '🕒', text: '24/7 在线服务' },
              ].map((item, index) => (
                <motion.div 
                  className="flex items-center gap-3 text-chinese-ink-500 font-chinese"
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <motion.div 
          className="mt-12 pt-8 border-t border-chinese-red-500/10 flex flex-col md:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-sm text-chinese-ink-400 font-chinese">
            © 2025 凤凰城华人目录. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-chinese-ink-400">
            <Link href="/privacy" className="hover:text-chinese-red-600 transition-colors">
              隐私政策
            </Link>
            <Link href="/terms" className="hover:text-chinese-red-600 transition-colors">
              使用条款
            </Link>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-chinese-gold-500/10 to-chinese-red-500/10 rounded-full blur-3xl -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-chinese-jade-500/10 to-chinese-gold-500/10 rounded-full blur-2xl translate-y-12 -translate-x-12" />
      </div>
    </footer>
  );
};