'use client';

import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { getTranslations, Language } from "@/lib/translations";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Play, Pause, RotateCcw, Zap } from 'lucide-react';

export function Features() {
  const [isEnglish, setIsEnglish] = useState(true);
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

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

  const handleFeatureClick = (index: number) => {
    setActiveFeature(activeFeature === index ? null : index);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
  };

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
            <Card
              key={index}
              className={cn(
                "group relative cursor-pointer transition-all duration-300",
                "hover:shadow-lg hover:transform hover:-translate-y-1",
                activeFeature === index && "ring-2 ring-blue-500 shadow-xl"
              )}
              onClick={() => handleFeatureClick(index)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className={cn(
                      "text-3xl mr-4 transition-transform duration-300",
                      isAnimating && activeFeature === index && "animate-pulse"
                    )}>
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                  </div>
                  <div className={cn(
                    "w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center transition-all duration-300",
                    activeFeature === index ? "scale-110" : "scale-0 group-hover:scale-100"
                  )}>
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* 互动演示区域 */}
                {activeFeature === index && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-700">
                        {isEnglish ? "Interactive Demo" : "互动演示"}
                      </span>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="w-8 h-8 p-0">
                          <Play className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="w-8 h-8 p-0">
                          <RotateCcw className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="h-20 bg-gradient-to-r from-blue-100 to-cyan-100 rounded border-2 border-dashed border-blue-300 flex items-center justify-center">
                      <span className="text-xs text-blue-600">
                        {isEnglish ? "Click to interact with this feature" : "点击与此功能互动"}
                      </span>
                    </div>
                  </div>
                )}
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
                {translations.features.cta.button}
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
                onClick={() => window.open('https://nav-ai.net/', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {isEnglish ? "Visit Nav - AI" : "访问 Nav - AI"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
