'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Sparkles, Zap, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getTranslations, Language, detectBrowserLanguage } from "@/lib/translations";

export default function Hero() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [heroVideoLoaded, setHeroVideoLoaded] = useState(false);

  // 初始化时从本地存储读取语言设置，如果没有则检测浏览器语言
  useEffect(() => {
    const savedLanguage = localStorage.getItem('genie3-language') as Language;
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    } else {
      // 检测浏览器语言
      const detectedLanguage = detectBrowserLanguage();
      setCurrentLanguage(detectedLanguage);
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

  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-[80vh] flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8 text-center lg:text-left max-w-xl mx-auto lg:mx-0">
            <div className="space-y-2 sm:space-y-3 lg:space-y-4">
              <div className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-xs sm:text-sm font-medium">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                {translations.hero?.badge || "AI-Powered 3D World Generation"}
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                {translations.hero?.title || "Create Stunning 3D Worlds with AI"}
              </h1>
              <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed text-no-truncate text-container">
                {translations.hero?.subtitle || "Genie 3 uses advanced artificial intelligence technologies to generate realistic 3D worlds and landscapes based on your descriptions"}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center lg:justify-start relative z-10">
              <a 
                href="/generator" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 h-9 sm:h-10 lg:h-11 px-3 sm:px-4 lg:px-6 text-xs sm:text-sm lg:text-base bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white cursor-pointer relative z-10 w-full sm:w-auto"
                style={{ pointerEvents: 'auto' }}
              >
                <span className="truncate">{typeof translations.hero?.cta === 'object' ? translations.hero.cta.primary : translations.hero?.cta || "Start Creating"}</span>
                <ArrowRight className="ml-2 w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 flex-shrink-0" />
              </a>
              <a 
                href="/cases" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 h-9 sm:h-10 lg:h-11 px-3 sm:px-4 lg:px-6 text-xs sm:text-sm lg:text-base border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white cursor-pointer relative z-10 w-full sm:w-auto"
                style={{ pointerEvents: 'auto' }}
              >
                <Play className="mr-2 w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                <span className="truncate">{typeof translations.hero?.cta === 'object' ? translations.hero.cta.secondary : "View Examples"}</span>
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 xl:gap-8 pt-4 sm:pt-6 lg:pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">10K+</div>
                <div className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                  {translations.hero?.stats?.worlds || "Worlds Created"}
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">50+</div>
                <div className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                  {translations.hero?.stats?.templates || "Templates"}
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">99%</div>
                <div className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                  {translations.hero?.stats?.satisfaction || "Satisfaction"}
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Feature Preview */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-3 sm:p-4 lg:p-6 xl:p-8 space-y-2 sm:space-y-3 lg:space-y-4 xl:space-y-6 border border-gray-200 dark:border-gray-700 w-full max-w-sm mx-auto lg:max-w-md lg:mx-0">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">
                  {translations.hero?.preview?.title || "Quick Preview"}
                </h2>
                <div className="flex space-x-1 sm:space-x-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-400 rounded-full"></div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>
              
              <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 sm:p-3 lg:p-4 border border-gray-200 dark:border-gray-600">
                  <p className="text-gray-700 dark:text-gray-300 italic text-xs sm:text-sm">
                    &ldquo;{translations.hero?.preview?.example?.text || "Creates a peaceful valley with a winding stream through emerald green grass, distant mountains like ink paintings, white clouds floating..."}&rdquo;
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <div className="w-10 sm:w-12 lg:w-16 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full animate-pulse"></div>
                </div>
                
                <div className="bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/50 dark:to-blue-900/50 rounded-lg overflow-hidden h-24 sm:h-28 lg:h-32 xl:h-40 relative border border-gray-200 dark:border-gray-600">
                  {!heroVideoLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/50 dark:to-blue-900/50">
                      <div className="text-center space-y-1 sm:space-y-2">
                        <Globe className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-16 xl:h-16 mx-auto text-blue-600 dark:text-blue-400 animate-spin" />
                        <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                          {translations.hero?.preview?.generating || "Generating 3D World..."}
                        </p>
                      </div>
                    </div>
                  )}
                  <video
                    src="/video/hero.mp4"
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    onLoadedData={() => setHeroVideoLoaded(true)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}