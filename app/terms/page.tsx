'use client';

import React, { useState, useEffect } from 'react';
import { FileText, ArrowLeft, Languages, Calendar, CheckCircle, AlertTriangle, Users, Shield, Zap, BookOpen, Scale, Lock, Eye, Heart, Star, Award, Gavel, Settings, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TermsOfServicePage() {
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
      title: "Terms of Service",
      subtitle: "Please read these terms carefully before using Genie 3. By using our service, you agree to these terms.",
      lastUpdated: "Last Updated: January 2025",
      sections: [
        {
          title: "Acceptance of Terms",
          icon: <Award className="w-6 h-6" />,
          content: "By accessing and using Genie 3, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service."
        },
        {
          title: "Service Description",
          icon: <Zap className="w-6 h-6" />,
          content: "Genie 3 is an AI-powered 3D world generation platform that allows users to create virtual environments through text descriptions. Our service includes AI generation tools, real-time preview, and content management features."
        },
        {
          title: "User Responsibilities",
          icon: <Users className="w-6 h-6" />,
          content: "You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account. You must not use the service for any illegal or unauthorized purpose."
        },
        {
          title: "Content Guidelines",
          icon: <AlertTriangle className="w-6 h-6" />,
          content: "You agree not to generate content that is illegal, harmful, threatening, abusive, defamatory, or otherwise objectionable. Genie 3 reserves the right to remove any content that violates these guidelines."
        },
        {
          title: "Intellectual Property",
          icon: <Shield className="w-6 h-6" />,
          content: "You retain ownership of content you create using Genie 3. However, you grant us a license to use, store, and display your content in connection with providing and improving our services."
        },
        {
          title: "Limitation of Liability",
          icon: <Scale className="w-6 h-6" />,
          content: "Genie 3 is provided 'as is' without warranties of any kind. We shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service."
        },
        {
          title: "Service Modifications",
          icon: <BookOpen className="w-6 h-6" />,
          content: "We reserve the right to modify or discontinue the service at any time without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the service."
        },
        {
          title: "Termination",
          icon: <Lock className="w-6 h-6" />,
          content: "We may terminate or suspend your account and access to the service immediately, without prior notice, for any reason, including breach of these Terms of Service."
        }
      ],
      contact: "If you have any questions about these Terms of Service, please contact us.",
      backButton: "Back to Genie 3"
    },
    zh: {
      title: "服务条款",
      subtitle: "使用Genie 3之前，请仔细阅读这些条款。使用我们的服务即表示您同意这些条款。",
      lastUpdated: "最后更新：2025年1月",
      sections: [
        {
          title: "条款接受",
          icon: <Award className="w-6 h-6" />,
          content: "通过访问和使用Genie 3，您接受并同意受本协议条款和规定的约束。如果您不同意遵守上述条款，请不要使用此服务。"
        },
        {
          title: "服务描述",
          icon: <Zap className="w-6 h-6" />,
          content: "Genie 3是一个AI驱动的3D世界生成平台，允许用户通过文本描述创建虚拟环境。我们的服务包括AI生成工具、实时预览和内容管理功能。"
        },
        {
          title: "用户责任",
          icon: <Users className="w-6 h-6" />,
          content: "您有责任维护账户的机密性，并对账户下发生的所有活动负责。您不得将服务用于任何非法或未经授权的目的。"
        },
        {
          title: "内容准则",
          icon: <AlertTriangle className="w-6 h-6" />,
          content: "您同意不生成非法、有害、威胁、辱骂、诽谤或其他令人反感的内容。Genie 3保留删除任何违反这些准则的内容的权利。"
        },
        {
          title: "知识产权",
          icon: <Shield className="w-6 h-6" />,
          content: "您保留使用Genie 3创建的内容的所有权。但是，您授予我们使用、存储和显示您内容的许可，以提供和改进我们的服务。"
        },
        {
          title: "责任限制",
          icon: <Scale className="w-6 h-6" />,
          content: "Genie 3按'现状'提供，不提供任何形式的保证。对于您使用服务而产生的任何间接、偶然、特殊、后果性或惩罚性损害，我们不承担责任。"
        },
        {
          title: "服务修改",
          icon: <BookOpen className="w-6 h-6" />,
          content: "我们保留随时修改或停止服务的权利，恕不另行通知。对于服务的任何修改、暂停或停止，我们对您或任何第三方不承担责任。"
        },
        {
          title: "终止",
          icon: <Lock className="w-6 h-6" />,
          content: "我们可能会立即终止或暂停您的账户和服务访问权限，恕不另行通知，原因包括违反这些服务条款。"
        }
      ],
      contact: "如果您对这些服务条款有任何疑问，请联系我们。",
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
            <FileText size={40} className="text-white drop-shadow-lg" />
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
