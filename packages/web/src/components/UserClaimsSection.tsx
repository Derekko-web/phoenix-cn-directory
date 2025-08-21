'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface Claim {
  id: string;
  businessId: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  createdAt: string;
  business: {
    localized: Array<{
      lang: string;
      name: string;
    }>;
  };
}

export default function UserClaimsSection() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const currentLocale = pathname.startsWith('/zh') ? 'zh' : 'en';

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/claims/my-claims`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setClaims(data);
        }
      } catch (error) {
        console.error('Failed to fetch claims:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return currentLocale === 'zh' ? '已验证' : 'Verified';
      case 'REJECTED':
        return currentLocale === 'zh' ? '已拒绝' : 'Rejected';
      default:
        return currentLocale === 'zh' ? '待审核' : 'Pending';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-chinese-ink-900">
            {currentLocale === 'zh' ? '商家申请' : 'Business Claims'}
          </h2>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-chinese-ink-900">
          {currentLocale === 'zh' ? '商家申请' : 'Business Claims'}
        </h2>
      </div>

      {claims.length === 0 ? (
        <div className="text-center py-8 text-chinese-ink-600">
          <p className="mb-4">
            {currentLocale === 'zh' ? '您还没有提交任何商家申请' : 'You haven\'t submitted any business claims yet'}
          </p>
          <p className="text-sm">
            {currentLocale === 'zh' 
              ? '在商家详情页面点击"认领商家"按钮来申请拥有商家'
              : 'Visit a business page and click "Claim Business" to submit ownership claims'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => {
            const businessName = claim.business.localized.find(
              (loc) => loc.lang === currentLocale
            )?.name || claim.business.localized[0]?.name;

            return (
              <div key={claim.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-chinese-ink-900">
                    {businessName}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.verificationStatus)}`}>
                    {getStatusText(claim.verificationStatus)}
                  </span>
                </div>
                <p className="text-sm text-chinese-ink-600">
                  {currentLocale === 'zh' ? '提交于：' : 'Submitted on:'} {' '}
                  {new Date(claim.createdAt).toLocaleDateString()}
                </p>
                {claim.verificationStatus === 'PENDING' && (
                  <p className="text-xs text-chinese-ink-500 mt-2">
                    {currentLocale === 'zh' 
                      ? '我们正在审查您的申请，请耐心等待。'
                      : 'We are reviewing your claim. Please be patient.'
                    }
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}