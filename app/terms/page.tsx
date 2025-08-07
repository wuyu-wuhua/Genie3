'use client';

import React, { useState, useEffect } from 'react';
import { FileText, ArrowLeft, Languages, Calendar, CheckCircle, AlertTriangle, Users, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TermsOfServicePage() {
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
      title: "Terms of Service",
      subtitle: "Please read these terms carefully before using Genie 3. By using our service, you agree to these terms.",
      lastUpdated: "Last Updated: January 2025",
      sections: [
        {
          title: "Acceptance of Terms",
          icon: <CheckCircle className="w-6 h-6" />,
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
          icon: <AlertTriangle className="w-6 h-6" />,
          content: "Genie 3 is provided 'as is' without warranties of any kind. We shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service."
        },
        {
          title: "Service Modifications",
          icon: <Zap className="w-6 h-6" />,
          content: "We reserve the right to modify or discontinue the service at any time without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the service."
        },
        {
          title: "Termination",
          icon: <CheckCircle className="w-6 h-6" />,
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
          icon: <CheckCircle className="w-6 h-6" />,
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
          icon: <AlertTriangle className="w-6 h-6" />,
          content: "Genie 3按'现状'提供，不提供任何形式的保证。对于您使用服务而产生的任何间接、偶然、特殊、后果性或惩罚性损害，我们不承担责任。"
        },
        {
          title: "服务修改",
          icon: <Zap className="w-6 h-6" />,
          content: "我们保留随时修改或停止服务的权利，恕不另行通知。对于服务的任何修改、暂停或停止，我们对您或任何第三方不承担责任。"
        },
        {
          title: "终止",
          icon: <CheckCircle className="w-6 h-6" />,
          content: "我们可能会立即终止或暂停您的账户和服务访问权限，恕不另行通知，原因包括违反这些服务条款。"
        }
      ],
      contact: "如果您对这些服务条款有任何疑问，请联系我们。",
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full mb-6">
            <FileText size={32} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
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
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <div className="text-blue-600">
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
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 text-center border border-blue-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {isEnglish ? "Contact Us" : "联系我们"}
            </h3>
            <p className="text-gray-600 mb-6">
              {currentContent.contact}
            </p>
                         <Button 
               className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
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
            className="bg-white/80 backdrop-blur-sm border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-all duration-200"
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
