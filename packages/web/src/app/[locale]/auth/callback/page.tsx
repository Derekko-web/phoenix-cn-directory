'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');

      if (accessToken && refreshToken) {
        // Store tokens
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);

        // Fetch user data
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/profile`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            localStorage.setItem('user', JSON.stringify(userData));
            
            // Redirect to home page
            router.push('/');
          } else {
            throw new Error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Auth callback error:', error);
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-chinese-red-50 to-chinese-gold-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-chinese-red-500 to-chinese-gold-500 rounded-2xl flex items-center justify-center text-white font-chinese font-bold text-2xl mx-auto mb-4 shadow-lg animate-pulse">
          凤
        </div>
        <h2 className="text-xl font-semibold text-chinese-ink-900 mb-2">
          Completing sign in...
        </h2>
        <p className="text-chinese-ink-600">Please wait while we finish setting up your account.</p>
      </div>
    </div>
  );
}