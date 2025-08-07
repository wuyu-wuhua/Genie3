'use client';

import React, { useState, useEffect } from 'react';
import { Shield, ArrowLeft, Languages, Calendar, Eye, Lock, Users, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
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

  const toggleLanguage = () => {
    const newLanguage = !isEnglish;
    setIsEnglish(newLanguage);
    
    // 触发自定义事件，通知其他组件语言已切换
    window.dispatchEvent(new CustomEvent('languageChange', {
      detail: { isEnglish: newLanguage }
    }));
  };

  const content = {
    en: {
      title: "Privacy Policy",
      subtitle: "Your privacy is important to us. This policy explains how Genie 3 collects, uses, and protects your information.",
      lastUpdated: "Last Updated: January 2025",
      sections: [
        {
          title: "Information We Collect",
          icon: <Database className="w-6 h-6" />,
          content: "Genie 3 collects information you provide directly to us, such as when you create an account, use our services, or contact us. This may include your name, email address, and any content you generate using our AI tools."
        },
        {
          title: "How We Use Your Information",
          icon: <Eye className="w-6 h-6" />,
          content: "We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to develop new features. We may also use your information to ensure the security of our platform and to comply with legal obligations."
        },
        {
          title: "Information Sharing",
          icon: <Users className="w-6 h-6" />,
          content: "Genie 3 does not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share information with service providers who assist us in operating our platform."
        },
        {
          title: "Data Security",
          icon: <Lock className="w-6 h-6" />,
          content: "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure."
        },
        {
          title: "Your Rights",
          icon: <Shield className="w-6 h-6" />,
          content: "You have the right to access, update, or delete your personal information. You may also request that we restrict the processing of your information or object to certain uses of your data."
        },
        {
          title: "Cookies and Tracking",
          icon: <Eye className="w-6 h-6" />,
          content: "We use cookies and similar technologies to enhance your experience on our platform. You can control cookie settings through your browser preferences."
        }
      ],
      contact: "If you have any questions about this Privacy Policy, please contact us.",
      backButton: "Back to Genie 3"
    },
    zh: {
      title: "隐私政策",
      subtitle: "您的隐私对我们很重要。本政策说明了Genie 3如何收集、使用和保护您的信息。",
      lastUpdated: "最后更新：2025年1月",
      sections: [
        {
          title: "我们收集的信息",
          icon: <Database className="w-6 h-6" />,
          content: "Genie 3收集您直接提供给我们的信息，例如当您创建账户、使用我们的服务或联系我们时。这可能包括您的姓名、电子邮件地址以及您使用我们的AI工具生成的任何内容。"
        },
        {
          title: "我们如何使用您的信息",
          icon: <Eye className="w-6 h-6" />,
          content: "我们使用收集的信息来提供、维护和改进我们的服务，与您沟通，并开发新功能。我们也可能使用您的信息来确保我们平台的安全性并遵守法律义务。"
        },
        {
          title: "信息共享",
          icon: <Users className="w-6 h-6" />,
          content: "Genie 3不会在未经您同意的情况下向第三方出售、交易或以其他方式转让您的个人信息，除非本政策中另有说明。我们可能与协助我们运营平台的服务提供商共享信息。"
        },
        {
          title: "数据安全",
          icon: <Lock className="w-6 h-6" />,
          content: "我们实施适当的安全措施来保护您的个人信息免受未经授权的访问、更改、披露或破坏。但是，通过互联网传输的方法并非100%安全。"
        },
        {
          title: "您的权利",
          icon: <Shield className="w-6 h-6" />,
          content: "您有权访问、更新或删除您的个人信息。您也可以要求我们限制对您信息的处理或反对对您数据的某些使用。"
        },
        {
          title: "Cookie和跟踪",
          icon: <Eye className="w-6 h-6" />,
          content: "我们使用Cookie和类似技术来增强您在我们平台上的体验。您可以通过浏览器首选项控制Cookie设置。"
        }
      ],
      contact: "如果您对本隐私政策有任何疑问，请联系我们。",
      backButton: "返回Genie 3"
    }
  };

  const currentContent = isEnglish ? content.en : content.zh;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-12">
        {/* 头部 */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-500 rounded-full mb-6">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {currentContent.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-4">
            {currentContent.subtitle}
          </p>
          <div className="flex items-center justify-center text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">{currentContent.lastUpdated}</span>
          </div>
        </div>

        {/* 内容 */}
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-8">
            {currentContent.sections.map((section, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <div className="text-green-600">
                      {section.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {section.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {section.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 联系信息 */}
          <div className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 text-center border border-green-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {isEnglish ? "Contact Us" : "联系我们"}
            </h3>
            <p className="text-gray-600 mb-6">
              {currentContent.contact}
            </p>
                         <Button 
               className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
               onClick={() => {
                 // 触发悬浮帮助按钮的点击事件
                 const helpButton = document.querySelector('[data-help-button]') as HTMLElement;
                 if (helpButton) {
                   helpButton.click();
                 }
               }}
             >
               {isEnglish ? "Get in Touch" : "联系我们"}
             </Button>
          </div>
        </div>

        {/* 返回按钮 */}
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            className="text-gray-600 hover:text-gray-900 border-gray-300 hover:border-gray-400 px-8 py-3 rounded-xl"
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
            className="bg-white/80 backdrop-blur-sm border-gray-300 hover:border-green-500 hover:text-green-600 transition-all duration-200"
          >
            <Languages size={16} className="mr-2" />
            <span className="font-medium">{isEnglish ? "Genie 3中文" : "Genie 3 EN"}</span>
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
