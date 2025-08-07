'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Sparkles, Zap, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getTranslations, Language } from "@/lib/translations";

export default function Hero() {
  const [isEnglish, setIsEnglish] = useState(true);

  // 监听语言切换事件
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      setIsEnglish(event.detail.isEnglish);
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []);

  const currentLanguage: Language = isEnglish ? 'en' : 'zh';
  const translations = getTranslations(currentLanguage);

  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-white to-cyan-50 min-h-[80vh] flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                {translations.hero.badge}
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                {translations.hero.title}
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl">
                {translations.hero.subtitle}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 relative z-10">
              <a 
                href="/generator" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 h-11 px-8 text-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white cursor-pointer relative z-10"
                style={{ pointerEvents: 'auto' }}
              >
                {translations.hero.cta}
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
              <a 
                href="/generator" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 h-11 px-8 text-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-900 cursor-pointer relative z-10"
                style={{ pointerEvents: 'auto' }}
              >
                <Play className="mr-2 w-5 h-5" />
                {translations.hero.demo}
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-gray-900">10K+</div>
                <div className="text-gray-600">
                  {translations.hero.stats.worlds}
                </div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-gray-900">50+</div>
                <div className="text-gray-600">
                  {translations.hero.stats.templates}
                </div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-gray-900">99%</div>
                <div className="text-gray-600">
                  {translations.hero.stats.satisfaction}
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Feature Preview */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {translations.hero.preview.title}
                </h2>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 italic">
                    &ldquo;{translations.hero.preview.example.text}&rdquo;
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full animate-pulse"></div>
                </div>
                
                <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-lg p-6 h-48 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Globe className="w-16 h-16 mx-auto text-blue-600 animate-spin" />
                    <p className="text-gray-600">
                      {translations.hero.preview.generating}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 animate-bounce"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}