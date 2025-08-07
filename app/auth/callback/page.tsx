'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// 动态导入supabase

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { supabase } = await import('@/lib/supabase');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          router.push('/');
          return;
        }

        if (data.session) {
          // 登录成功，重定向到首页
          router.push('/');
        } else {
          // 没有会话，重定向到首页
          router.push('/');
        }
      } catch (error) {
        console.error('Failed to handle auth callback:', error);
        router.push('/');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Processing authentication...</p>
      </div>
    </div>
  );
} 