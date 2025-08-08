'use client';

import React, { useState, useEffect } from 'react';
import { Shield, ArrowLeft, Languages, Calendar, CheckCircle, AlertTriangle, Users, Eye, Lock, Zap, Heart, Star, Award, Scale, BookOpen, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  const [isEnglish, setIsEnglish] = useState(true);

  // 初始化时从本地存储读取语言设置
  useEffect(() => {
    const savedLanguage = localStorage.getItem('genie3-language');
    if (savedLanguage) {
      const isEnglishSaved = savedLanguage === 'en';
      setIsEnglish(isEnglishSaved);
    }

    const handleLanguageChange = (event: CustomEvent) => {
      setIsEnglish(event.detail.isEnglish);
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []);

  const toggleLanguage = () => {
    const newLanguage = !isEnglish;
    setIsEnglish(newLanguage);
    
    // 保存语言选择到本地存储
    localStorage.setItem('genie3-language', newLanguage ? 'en' : 'zh');
    
    // 触发自定义事件，通知其他组件语言已切换
    window.dispatchEvent(new CustomEvent('languageChange', {
      detail: { isEnglish: newLanguage }
    }));
  };

  const content = {
    en: {
      title: "Privacy Policy",
      subtitle: "We are committed to protecting your privacy and ensuring the security of your personal information. This policy explains how we collect, use, and protect your data.",
      lastUpdated: "Last Updated: January 2025",
      sections: [
        {
          title: "Information We Collect",
          icon: <Eye className="w-6 h-6" />,
          content: "We collect information you provide directly to us, such as when you create an account, use our services, or contact us. This may include your name, email address, and any content you create using Genie 3."
        },
        {
          title: "How We Use Your Information",
          icon: <Zap className="w-6 h-6" />,
          content: "We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to develop new features. We may also use your information to ensure the security of our platform."
        },
        {
          title: "Information Sharing",
          icon: <Users className="w-6 h-6" />,
          content: "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law."
        },
        {
          title: "Data Security",
          icon: <Lock className="w-6 h-6" />,
          content: "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure."
        },
        {
          title: "Data Retention",
          icon: <Calendar className="w-6 h-6" />,
          content: "We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. You may request deletion of your data at any time."
        },
        {
          title: "Your Rights",
          icon: <Award className="w-6 h-6" />,
          content: "You have the right to access, correct, or delete your personal information. You may also have the right to restrict or object to certain processing of your data."
        },
        {
          title: "Cookies and Tracking",
          icon: <Globe className="w-6 h-6" />,
          content: "We use cookies and similar technologies to enhance your experience on our platform. You can control cookie settings through your browser preferences."
        },
        {
          title: "Changes to This Policy",
          icon: <BookOpen className="w-6 h-6" />,
          content: "We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the 'Last Updated' date."
        }
      ],
      contact: "If you have any questions about this Privacy Policy, please contact us.",
      backButton: "Back to Genie 3"
    },
    zh: {
      title: "隐私政策",
      subtitle: "我们致力于保护您的隐私并确保您个人信息的安全。本政策说明了我们如何收集、使用和保护您的数据。",
      lastUpdated: "最后更新：2025年1月",
      sections: [
        {
          title: "我们收集的信息",
          icon: <Eye className="w-6 h-6" />,
          content: "我们收集您直接提供给我们的信息，例如当您创建账户、使用我们的服务或联系我们时。这可能包括您的姓名、电子邮件地址以及您使用Genie 3创建的任何内容。"
        },
        {
          title: "我们如何使用您的信息",
          icon: <Zap className="w-6 h-6" />,
          content: "我们使用收集的信息来提供、维护和改进我们的服务，与您沟通，并开发新功能。我们也可能使用您的信息来确保我们平台的安全。"
        },
        {
          title: "信息共享",
          icon: <Users className="w-6 h-6" />,
          content: "未经您的同意，我们不会向第三方出售、交易或以其他方式转让您的个人信息，除非本政策中描述或法律要求的情况。"
        },
        {
          title: "数据安全",
          icon: <Lock className="w-6 h-6" />,
          content: "我们实施适当的安全措施来保护您的个人信息免受未经授权的访问、更改、披露或破坏。但是，通过互联网传输的任何方法都不是100%安全的。"
        },
        {
          title: "数据保留",
          icon: <Calendar className="w-6 h-6" />,
          content: "我们保留您的个人信息的时间以提供我们的服务和履行本政策中概述的目的所需的时间为准。您可以随时请求删除您的数据。"
        },
        {
          title: "您的权利",
          icon: <Award className="w-6 h-6" />,
          content: "您有权访问、更正或删除您的个人信息。您也可能有权限制或反对对您数据的某些处理。"
        },
        {
          title: "Cookie和跟踪",
          icon: <Globe className="w-6 h-6" />,
          content: "我们使用cookie和类似技术来增强您在我们平台上的体验。您可以通过浏览器首选项控制cookie设置。"
        },
        {
          title: "本政策的变更",
          icon: <BookOpen className="w-6 h-6" />,
          content: "我们可能会不时更新此隐私政策。我们将通过在此页面上发布新政策并更新'最后更新'日期来通知您任何重大变更。"
        }
      ],
      contact: "如果您对本隐私政策有任何疑问，请联系我们。",
      backButton: "返回Genie 3"
    }
  };

  const currentContent = isEnglish ? content.en : content.zh;

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
            <Shield size={40} className="text-white drop-shadow-lg" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
            {currentContent.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-4">
            {currentContent.subtitle}
          </p>
          <div className="inline-flex items-center justify-center text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 rounded-full px-3 py-1 backdrop-blur-sm">
            <Calendar className="w-3 h-3 mr-1 text-blue-500" />
            <span className="text-xs font-medium">{currentContent.lastUpdated}</span>
          </div>
        </div>

        {/* 内容 */}
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-8">
            {currentContent.sections.map((section, index) => (
              <div key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 hover:transform hover:-translate-y-1">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 via-purple-100 to-cyan-100 dark:from-blue-900/50 dark:via-purple-900/50 dark:to-cyan-900/50 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg transform hover:scale-110 transition-transform duration-300">
                    <div className="text-blue-600 dark:text-blue-400 drop-shadow-sm">
                      {section.icon}
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
              {isEnglish ? "Contact Us" : "联系我们"}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {currentContent.contact}
            </p>
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
              {isEnglish ? "Get in Touch" : "联系我们"}
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
            {currentContent.backButton}
          </Button>
        </div>

        {/* 翻译按钮 */}
        <div className="fixed top-4 right-4 z-50">
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleLanguage}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Languages size={16} className="mr-2" />
            <span className="font-medium text-gray-900 dark:text-white">{isEnglish ? "Genie 3中文" : "Genie 3 EN"}</span>
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