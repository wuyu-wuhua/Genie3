'use client';

import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { getTranslations, Language } from "@/lib/translations";

export function Features() {
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
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {translations.features.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {translations.features.subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {translations.features.features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                "group relative p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300",
                "shadow-sm hover:shadow-md transition-all duration-300",
                "hover:transform hover:-translate-y-1"
              )}
            >
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
              
              {/* 悬停效果 */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl -z-10"></div>
            </div>
          ))}
        </div>
        
        {/* 底部CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              {translations.features.cta.title}
            </h3>
            <p className="text-lg mb-6 opacity-90">
              {translations.features.cta.description}
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
              {translations.features.cta.button}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
