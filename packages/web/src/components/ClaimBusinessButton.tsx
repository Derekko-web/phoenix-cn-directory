'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { useAuth } from '../contexts/AuthContext';

interface ClaimBusinessButtonProps {
  businessId: string;
  businessName: string;
  isOwned?: boolean;
}

export default function ClaimBusinessButton({ 
  businessId, 
  businessName, 
  isOwned = false 
}: ClaimBusinessButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [evidence, setEvidence] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { isAuthenticated, user } = useAuth();
  const currentLocale = useLocale() as 'en' | 'zh';

  if (!isAuthenticated || isOwned) {
    return null;
  }

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/claims`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          businessId,
          evidence: JSON.stringify({
            userEmail: user?.email,
            businessName,
            reason: evidence,
            submittedAt: new Date().toISOString(),
          }),
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccess(false);
          setEvidence('');
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to submit claim');
      }
    } catch (err) {
      setError('Failed to submit claim. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-chinese-gold-600 text-white rounded-lg hover:bg-chinese-gold-700 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {currentLocale === 'zh' ? '认领商家' : 'Claim Business'}
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-chinese-gold-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-chinese-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-chinese-ink-900">
                    {currentLocale === 'zh' ? '认领商家' : 'Claim Business'}
                  </h3>
                  <p className="text-chinese-ink-600 text-sm">
                    {businessName}
                  </p>
                </div>
              </div>

              {success ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-chinese-ink-900 mb-2">
                    {currentLocale === 'zh' ? '申请已提交！' : 'Claim Submitted!'}
                  </h4>
                  <p className="text-chinese-ink-600 text-sm">
                    {currentLocale === 'zh' 
                      ? '我们将审查您的申请并尽快与您联系。'
                      : 'We will review your claim and get back to you soon.'
                    }
                  </p>
                </div>
              ) : (
                <form onSubmit={handleClaimSubmit}>
                  <div className="mb-4">
                    <p className="text-chinese-ink-700 mb-4">
                      {currentLocale === 'zh' 
                        ? '请提供证明您拥有或管理此商家的信息。这将帮助我们验证您的申请。'
                        : 'Please provide information to verify that you own or manage this business. This will help us validate your claim.'
                      }
                    </p>
                    <label className="block text-sm font-medium text-chinese-ink-700 mb-2">
                      {currentLocale === 'zh' ? '验证信息' : 'Verification Information'}
                    </label>
                    <textarea
                      value={evidence}
                      onChange={(e) => setEvidence(e.target.value)}
                      placeholder={currentLocale === 'zh' 
                        ? '例如：我是这家餐厅的老板，我的电话号码是...，我可以提供营业执照等文件作为证明。'
                        : 'e.g., I am the owner of this restaurant, my phone number is..., I can provide business license documentation as proof.'
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-chinese-gold-500 focus:border-transparent resize-none"
                      rows={4}
                      required
                    />
                  </div>

                  {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {currentLocale === 'zh' ? '取消' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !evidence.trim()}
                      className="flex-1 px-4 py-2 bg-chinese-gold-600 text-white rounded-lg hover:bg-chinese-gold-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading 
                        ? (currentLocale === 'zh' ? '提交中...' : 'Submitting...')
                        : (currentLocale === 'zh' ? '提交申请' : 'Submit Claim')
                      }
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}