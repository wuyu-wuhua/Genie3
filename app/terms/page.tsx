'use client';

import React, { useState, useEffect } from 'react';
import { FileText, ArrowLeft, Languages, Calendar, CheckCircle, AlertTriangle, Users, Shield, Zap, BookOpen, Scale, Lock, Eye, Heart, Star, Award, Gavel, Settings, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getTranslations, Language, detectBrowserLanguage } from '@/lib/translations';

export default function TermsOfServicePage() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 dark:bg-blue-800/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 dark:bg-cyan-800/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-purple-200 dark:bg-purple-800/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-12">
        {/* 头部 */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 rounded-2xl mb-6 shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <FileText size={40} className="text-white drop-shadow-lg" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
            {translations.terms.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-4">
            {translations.terms.subtitle}
          </p>
          <div className="inline-flex items-center justify-center text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 rounded-full px-3 py-1 backdrop-blur-sm">
            <Calendar className="w-3 h-3 mr-1 text-blue-500" />
            <span className="text-xs font-medium">{translations.terms.lastUpdated}</span>
          </div>
        </div>

        {/* 内容 */}
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-8">
            {translations.terms.sections.map((section, index) => (
              <div key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 hover:transform hover:-translate-y-1">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 via-purple-100 to-cyan-100 dark:from-blue-900/50 dark:via-purple-900/50 dark:to-cyan-900/50 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg transform hover:scale-110 transition-transform duration-300">
                    <div className="text-blue-600 dark:text-blue-400 drop-shadow-sm">
                      {getSectionIcon(index)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {section.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                      {section.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 联系信息 */}
          <div className="mt-12 bg-gradient-to-r from-blue-50 via-purple-50 to-cyan-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-cyan-900/20 rounded-2xl p-8 text-center border border-blue-100 dark:border-blue-800 shadow-xl">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4 shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {translations.terms.contact}
            </h3>
            <Button 
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              onClick={() => {
                // 触发悬浮帮助按钮的点击事件
                const helpButton = document.querySelector('[data-help-button]') as HTMLElement;
                if (helpButton) {
                  helpButton.click();
                }
              }}
            >
              <Star className="w-4 h-4 mr-2" />
              {translations.terms.getInTouch}
            </Button>
          </div>
        </div>

        {/* 返回按钮 */}
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={18} className="mr-2" />
            {translations.terms.backButton}
          </Button>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

// 辅助函数：根据索引返回对应的图标
function getSectionIcon(index: number) {
  const icons = [
    <Award key="award" className="w-6 h-6" />,
    <Zap key="zap" className="w-6 h-6" />,
    <Users key="users" className="w-6 h-6" />,
    <AlertTriangle key="alert" className="w-6 h-6" />,
    <Shield key="shield" className="w-6 h-6" />,
    <Scale key="scale" className="w-6 h-6" />,
    <BookOpen key="book" className="w-6 h-6" />,
    <Lock key="lock" className="w-6 h-6" />
  ];
  return icons[index] || <FileText key="default" className="w-6 h-6" />;
}
