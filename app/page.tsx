'use client';

import Hero from '@/components/Hero';
import VideoShowcase from '@/components/VideoShowcase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { UserReviews } from '@/components/UserReviews';
import { Features } from '@/components/Features';
import { getTranslations, Language } from "@/lib/translations";
import { 
  Zap, 
  Palette, 
  Globe, 
  Users, 
  ArrowRight, 
  Check,
  Sparkles,
  Brain,
  Eye,
  Layers,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function Home() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
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

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const translations = getTranslations(currentLanguage);

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: translations.features.features[0].title,
      description: translations.features.features[0].description
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: translations.features.features[1].title,
      description: translations.features.features[1].description
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: translations.features.features[2].title,
      description: translations.features.features[2].description
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: translations.features.features[3].title,
      description: translations.features.features[3].description
    }
  ];

  return (
    <div>
      <Hero />
      
      {/* Video Showcase Section */}
      <VideoShowcase />
      
      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-white dark:bg-gray-900">
        <div className="max-w-6xl lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              {translations.home.features.title}
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {translations.home.features.subtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              // 为每个图标定义不同的渐变色
              const gradients = [
                "bg-gradient-to-br from-purple-500 to-pink-500", // 紫色到粉色
                "bg-gradient-to-br from-green-500 to-emerald-500", // 绿色到翠绿
                "bg-gradient-to-br from-orange-500 to-red-500", // 橙色到红色
                "bg-gradient-to-br from-blue-500 to-indigo-500" // 蓝色到靛蓝
              ];
              
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white dark:bg-gray-800">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className={`w-12 h-12 ${gradients[index]} rounded-lg flex items-center justify-center text-white mx-auto transition-all duration-300 hover:scale-110 hover:shadow-lg`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* User Reviews Section */}
      <UserReviews />



      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full mb-6">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {translations.home.faq.title}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {translations.home.faq.subtitle}
            </p>
          </div>
          
          <div className="space-y-3 sm:space-y-4 max-w-3xl mx-auto">
            {translations.home.faq.faqs.map((faq, index) => (
              <Card key={index} className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white dark:bg-gray-800">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <span className="text-sm sm:text-base lg:text-lg font-medium text-gray-900 dark:text-white">{faq.question}</span>
                    <div className={`transition-transform duration-300 ease-in-out ${openFAQ === index ? 'rotate-180' : 'rotate-0'}`}>
                      <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      openFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className={`px-4 sm:px-6 transition-all duration-500 ease-in-out ${
                      openFAQ === index ? 'pb-3 sm:pb-4' : 'pb-0'
                    }`}>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8 sm:mt-12">
            <Button 
              variant="outline" 
              size="lg" 
              className="text-xs sm:text-sm lg:text-base px-3 sm:px-4 lg:px-6 py-2 sm:py-3 w-full sm:w-auto max-w-xs sm:max-w-none"
              style={{ 
                maxWidth: '20rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
              onClick={() => {
                // 触发悬浮帮助按钮的点击事件
                const helpButton = document.querySelector('[data-help-button]') as HTMLElement;
                if (helpButton) {
                  helpButton.click();
                }
              }}
            >
              <span className="truncate text-center block w-full">{translations.home.faq.contact}</span>
              <ArrowRight className="ml-2 w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 flex-shrink-0" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
            {translations.home.cta.title}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-blue-100 mb-6 sm:mb-8">
            {translations.home.cta.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              variant="secondary" 
              className="text-xs sm:text-sm lg:text-base px-3 sm:px-4 lg:px-6 py-2 sm:py-3 w-full sm:w-auto max-w-xs sm:max-w-none"
              style={{ 
                maxWidth: '20rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              <Link href="/generator" className="truncate block w-full text-center">
                {translations.home.cta.primary}
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              className="text-xs sm:text-sm lg:text-base px-3 sm:px-4 lg:px-6 py-2 sm:py-3 w-full sm:w-auto max-w-xs sm:max-w-none border-2 border-white bg-transparent text-white hover:bg-white hover:text-blue-600"
              style={{ 
                maxWidth: '20rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              <Link href="/about" className="truncate block w-full text-center">
                {translations.home.cta.secondary}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}