'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppStore } from '@/store';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAppStore(state => state.setUser);

  useEffect(() => {
    const code = searchParams.get('code');
    
    if (code) {
      setUser({
        id: 'google-' + Date.now(),
        email: 'user@gmail.com',
        name: 'Google User',
        role: 'user',
        createdAt: new Date().toISOString()
      });
      
      router.push('/dashboard');
    } else {
      router.push('/auth');
    }
  }, [searchParams, router, setUser]);

  return (
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Authenticating with Google...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <Suspense fallback={
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      }>
        <CallbackContent />
      </Suspense>
    </div>
  );
}
