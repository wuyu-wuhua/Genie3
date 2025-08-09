'use client';

import WorldGenerator from '@/components/WorldGenerator';
import { useState, useEffect } from 'react';
import { getTranslations, Language } from '@/lib/translations';

export default function GeneratorPage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  // 初始化时从本地存储读取语言设置，如果没有则检测浏览器语言
  useEffect(() => {
    const savedLanguage = localStorage.getItem('genie3-language') as Language;
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    } else {
      // 检测浏览器语言
      const { detectBrowserLanguage } = require('@/lib/translations');
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

  return (
    <div className="min-h-screen bg-gray-25 dark:bg-gray-900 py-8">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {currentLanguage === 'zh' ? "Genie 3 AI虚拟世界生成器" : "Genie 3 AI Virtual World Generator"}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {currentLanguage === 'zh' 
              ? "Genie 3在线3D环境创作工具 - 通过Genie 3的文本描述即刻创建您的专属虚拟世界"
              : "Genie 3 Online 3D Environment Creation Tool - Create Your Exclusive Virtual World Instantly Through Text Description with Genie 3"
            }
          </p>
          <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:amber-300 text-sm">
            <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
            {currentLanguage === 'zh' ? "Genie 3当前版本为概念验证，非最终产品" : "Genie 3 current version is a proof of concept, not a final product"}
          </div>
        </div>
      </div>
      
      <WorldGenerator />
    </div>
  );
}