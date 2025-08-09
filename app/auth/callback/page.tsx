'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getTranslations, Language, detectBrowserLanguage } from '@/lib/translations';
// 动态导入supabase

export default function AuthCallback() {
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  // 初始化时从本地存储读取语言设置，如果没有则检测浏览器语言
  useEffect(() => {
    const savedLanguage = localStorage.getItem('genie3-language') as Language;
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    } else {
      // 检测浏览器语言
      const detectedLanguage = detectBrowserLanguage();
      setCurrentLanguage(detectedLanguage);
      localStorage.setItem('genie3-language', detectedLanguage);
    }

    const handleLanguageChange = (event: CustomEvent) => {
      setCurrentLanguage(event.detail.language);
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []);

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

  const translations = getTranslations(currentLanguage);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">{translations.auth.processingAuthentication}</p>
      </div>
    </div>
  );
} 