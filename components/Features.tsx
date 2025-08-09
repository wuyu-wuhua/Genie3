'use client';

import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { getTranslations, Language, detectBrowserLanguage } from "@/lib/translations";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Zap, Sparkles, Brain } from 'lucide-react';

export function Features() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

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

  const handleFeatureClick = (index: number) => {
    setActiveFeature(activeFeature === index ? null : index);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const resetAnimation = () => {
    setIsAnimating(false);
    setActiveFeature(null);
  };

  const translations = getTranslations(currentLanguage);

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {translations.features.title}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {translations.features.subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {translations.features.features.map((feature, index) => (
            <Card
              key={index}
              className={cn(
                "group relative cursor-pointer transition-all duration-300",
                "bg-white dark:bg-gray-800/90 backdrop-blur-sm",
                "border border-gray-200 dark:border-gray-600",
                "shadow-sm dark:shadow-lg",
                "hover:shadow-xl hover:transform hover:-translate-y-2",
                "hover:bg-white dark:hover:bg-gray-800",
                "hover:border-blue-300 dark:hover:border-blue-500",
                "hover:shadow-blue-500/10 dark:hover:shadow-blue-400/20",
                activeFeature === index && "ring-2 ring-blue-500 shadow-xl",
                isAnimating && activeFeature === index && "animate-pulse"
              )}
              onClick={() => handleFeatureClick(index)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className={cn(
                      "text-3xl mr-4 transition-all duration-300",
                      activeFeature === index && "scale-110"
                    )}>
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                  </div>
                  {activeFeature === index && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-8 h-8 p-0 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsAnimating(true);
                          setTimeout(() => setIsAnimating(false), 500);
                        }}
                      >
                        <Zap className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-8 h-8 p-0 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          resetAnimation();
                        }}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  {feature.description}
                </p>
                
                {activeFeature === index && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/50 dark:to-purple-900/50 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        {currentLanguage === 'en' ? "Interactive Demo" : "互动演示"}
                      </span>
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {currentLanguage === 'en' 
                        ? "Click the buttons above to see this feature in action!"
                        : "点击上方按钮查看此功能的实际效果！"
                      }
                    </p>
                  </div>
                )}
                
                {/* 悬停效果 - 修复深色模式 */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl -z-10"></div>
              </CardContent>
            </Card>
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
