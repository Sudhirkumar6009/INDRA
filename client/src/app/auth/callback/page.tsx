'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppStore } from '@/store';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAppStore(state => state.setUser);

  useEffect(() => {
    const code = searchParams.get('code');
    
    if (code) {
      // Mock Google OAuth user creation
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
    <div className="min-h-screen bg-green-50 dark:bg-green-950 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-green-700 dark:text-green-400">Authenticating with Google...</p>
      </div>
    </div>
  );
}
