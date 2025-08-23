'use client';

import React, { useState, useEffect } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getTranslations, Language, detectBrowserLanguage } from '@/lib/translations';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
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

  const translations = getTranslations(currentLanguage);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      // 动态导入supabase
      const { supabase } = await import('@/lib/supabase');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error('Google login error:', error);
      } else {
        // 登录成功，调用onSuccess回调
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // 根据当前语言获取翻译文本
  const getTranslatedText = (key: string, fallback: string) => {
    if (currentLanguage === 'zh') {
      const zhTranslations: { [key: string]: string } = {
        title: '欢迎回来',
        subtitle: '登录以继续使用 Genie 3',
        continueWithGoogle: '使用 Google 继续',
        or: '或者',
        continueAsGuest: '以访客身份继续'
      };
      return zhTranslations[key] || fallback;
    } else if (currentLanguage === 'ja') {
      const jaTranslations: { [key: string]: string } = {
        title: 'おかえりなさい',
        subtitle: 'Genie 3 を続行するにはログインしてください',
        continueWithGoogle: 'Google で続行',
        or: 'または',
        continueAsGuest: 'ゲストとして続行'
      };
      return jaTranslations[key] || fallback;
    } else if (currentLanguage === 'ko') {
      const koTranslations: { [key: string]: string } = {
        title: '다시 오신 것을 환영합니다',
        subtitle: 'Genie 3를 계속하려면 로그인하세요',
        continueWithGoogle: 'Google로 계속하기',
        or: '또는',
        continueAsGuest: '게스트로 계속하기'
      };
      return koTranslations[key] || fallback;
    } else if (currentLanguage === 'ru') {
      const ruTranslations: { [key: string]: string } = {
        title: 'Добро пожаловать обратно',
        subtitle: 'Войдите, чтобы продолжить работу с Genie 3',
        continueWithGoogle: 'Продолжить с Google',
        or: 'или',
        continueAsGuest: 'Продолжить как гость'
      };
      return ruTranslations[key] || fallback;
    } else if (currentLanguage === 'de') {
      const deTranslations: { [key: string]: string } = {
        title: 'Willkommen zurück',
        subtitle: 'Melden Sie sich an, um mit Genie 3 fortzufahren',
        continueWithGoogle: 'Mit Google fortfahren',
        or: 'oder',
        continueAsGuest: 'Als Gast fortfahren'
      };
      return deTranslations[key] || fallback;
    } else if (currentLanguage === 'fr') {
      const frTranslations: { [key: string]: string } = {
        title: 'Bon retour',
        subtitle: 'Connectez-vous pour continuer avec Genie 3',
        continueWithGoogle: 'Continuer avec Google',
        or: 'ou',
        continueAsGuest: 'Continuer en tant qu\'invité'
      };
      return frTranslations[key] || fallback;
    } else if (currentLanguage === 'es') {
      const esTranslations: { [key: string]: string } = {
        title: 'Bienvenido de vuelta',
        subtitle: 'Inicia sesión para continuar con Genie 3',
        continueWithGoogle: 'Continuar con Google',
        or: 'o',
        continueAsGuest: 'Continuar como invitado'
      };
      return esTranslations[key] || fallback;
    } else if (currentLanguage === 'it') {
      const itTranslations: { [key: string]: string } = {
        title: 'Bentornato',
        subtitle: 'Accedi per continuare con Genie 3',
        continueWithGoogle: 'Continua con Google',
        or: 'o',
        continueAsGuest: 'Continua come ospite'
      };
      return itTranslations[key] || fallback;
    }
    
    // 默认英文
    return fallback;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md mx-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-0 shadow-2xl transform -translate-y-0">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="flex-1" />
          </div>
          <CardTitle className="text-center text-2xl text-gray-900 dark:text-white font-bold">
            {getTranslatedText('title', 'Welcome Back')}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 text-base">
            {getTranslatedText('subtitle', 'Sign in to continue to Genie 3')}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Google Login Button */}
          <Button
            onClick={handleGoogleLogin}
            className="w-full bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 py-3 px-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {getTranslatedText('continueWithGoogle', 'Continue with Google')}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
                {getTranslatedText('or', 'or')}
              </span>
            </div>
          </div>

          {/* Guest Access */}
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-6 py-2 rounded-lg transition-all duration-300"
            >
              {getTranslatedText('continueAsGuest', 'Continue as Guest')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 