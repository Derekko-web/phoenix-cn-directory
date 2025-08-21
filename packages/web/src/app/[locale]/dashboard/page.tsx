'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useAuth } from '../../../contexts/AuthContext';
import UserClaimsSection from '../../../components/UserClaimsSection';

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const t = useTranslations('dashboard');
  const currentLocale = useLocale() as 'en' | 'zh';

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(`/${currentLocale}/login`);
    }
  }, [isAuthenticated, loading, router, currentLocale]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-chinese-red-50 to-chinese-gold-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-chinese-red-500 to-chinese-gold-500 rounded-2xl flex items-center justify-center text-white font-chinese font-bold text-2xl mx-auto mb-4 shadow-lg animate-pulse">
            凤
          </div>
          <h2 className="text-xl font-semibold text-chinese-ink-900">
            {currentLocale === 'zh' ? '加载中...' : 'Loading...'}
          </h2>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-chinese-red-50 to-chinese-gold-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-chinese-red-500 to-chinese-gold-500 rounded-2xl flex items-center justify-center text-white font-chinese font-bold text-3xl shadow-lg">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt="Profile"
                  className="w-full h-full rounded-2xl object-cover"
                />
              ) : (
                user.email[0].toUpperCase()
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-chinese-ink-900 mb-2">
                {currentLocale === 'zh' ? '用户仪表板' : 'User Dashboard'}
              </h1>
              <div className="text-chinese-ink-600">
                <p className="text-lg">
                  {currentLocale === 'zh' ? '欢迎回来' : 'Welcome back'}, {user.firstName || user.email}!
                </p>
                <p className="text-sm">
                  {currentLocale === 'zh' ? '成员自：' : 'Member since:'} {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Business Claims Section - Full Width */}
          <div className="md:col-span-2 lg:col-span-3">
            <UserClaimsSection />
          </div>
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-chinese-red-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-chinese-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-chinese-ink-900">
                {currentLocale === 'zh' ? '个人资料' : 'Profile'}
              </h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-chinese-ink-600">
                  {currentLocale === 'zh' ? '电子邮箱' : 'Email'}
                </label>
                <p className="text-chinese-ink-900">{user.email}</p>
              </div>
              {user.firstName && (
                <div>
                  <label className="text-sm font-medium text-chinese-ink-600">
                    {currentLocale === 'zh' ? '姓名' : 'Name'}
                  </label>
                  <p className="text-chinese-ink-900">{user.firstName} {user.lastName}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-chinese-ink-600">
                  {currentLocale === 'zh' ? '首选语言' : 'Preferred Language'}
                </label>
                <p className="text-chinese-ink-900">
                  {user.locale === 'zh' ? '中文' : 'English'}
                </p>
              </div>
            </div>
            <button className="mt-4 w-full bg-chinese-red-600 text-white py-2 px-4 rounded-lg hover:bg-chinese-red-700 transition-colors">
              {currentLocale === 'zh' ? '编辑资料' : 'Edit Profile'}
            </button>
          </div>

          {/* My Businesses Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-chinese-gold-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-chinese-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0v-5a2 2 0 012-2h4a2 2 0 012 2v5" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-chinese-ink-900">
                {currentLocale === 'zh' ? '我的商家' : 'My Businesses'}
              </h2>
            </div>
            <div className="text-center py-8 text-chinese-ink-600">
              <p className="mb-4">
                {currentLocale === 'zh' ? '您还没有添加任何商家' : 'You haven\'t added any businesses yet'}
              </p>
              <button className="bg-chinese-gold-600 text-white py-2 px-4 rounded-lg hover:bg-chinese-gold-700 transition-colors">
                {currentLocale === 'zh' ? '添加商家' : 'Add Business'}
              </button>
            </div>
          </div>

          {/* Activity Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-chinese-ink-900">
                {currentLocale === 'zh' ? '活动' : 'Activity'}
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-chinese-red-500 rounded-full"></div>
                <div className="text-sm">
                  <p className="text-chinese-ink-900 font-medium">
                    {currentLocale === 'zh' ? '账户已创建' : 'Account created'}
                  </p>
                  <p className="text-chinese-ink-600 text-xs">
                    {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-chinese-ink-900">
                {currentLocale === 'zh' ? '设置' : 'Settings'}
              </h2>
            </div>
            <div className="space-y-3">
              <button className="w-full text-left py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors text-chinese-ink-700">
                {currentLocale === 'zh' ? '账户设置' : 'Account Settings'}
              </button>
              <button className="w-full text-left py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors text-chinese-ink-700">
                {currentLocale === 'zh' ? '通知偏好' : 'Notification Preferences'}
              </button>
              <button className="w-full text-left py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors text-chinese-ink-700">
                {currentLocale === 'zh' ? '隐私设置' : 'Privacy Settings'}
              </button>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-chinese-ink-900">
                {currentLocale === 'zh' ? '快捷操作' : 'Quick Actions'}
              </h2>
            </div>
            <div className="space-y-3">
              <button className="w-full bg-chinese-gold-600 text-white py-2 px-4 rounded-lg hover:bg-chinese-gold-700 transition-colors">
                {currentLocale === 'zh' ? '添加商家' : 'Add Business'}
              </button>
              <button className="w-full border border-chinese-red-300 text-chinese-red-600 py-2 px-4 rounded-lg hover:bg-chinese-red-50 transition-colors">
                {currentLocale === 'zh' ? '写评价' : 'Write Review'}
              </button>
              <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                {currentLocale === 'zh' ? '浏览商家' : 'Browse Businesses'}
              </button>
            </div>
          </div>

          {/* Help & Support Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-chinese-ink-900">
                {currentLocale === 'zh' ? '帮助与支持' : 'Help & Support'}
              </h2>
            </div>
            <div className="space-y-3">
              <button className="w-full text-left py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors text-chinese-ink-700">
                {currentLocale === 'zh' ? '常见问题' : 'FAQ'}
              </button>
              <button className="w-full text-left py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors text-chinese-ink-700">
                {currentLocale === 'zh' ? '联系支持' : 'Contact Support'}
              </button>
              <button className="w-full text-left py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors text-chinese-ink-700">
                {currentLocale === 'zh' ? '使用指南' : 'User Guide'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}