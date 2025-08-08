'use client';

import Link from 'next/link';
import { Sparkles, Github, Mail, Twitter } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Footer() {
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

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Genie 3</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {isEnglish 
                ? "Genie 3 uses advanced AI technology to enable everyone to easily create their own 3D virtual worlds. From simple text descriptions to complex virtual environments, Genie 3 turns creativity into reality. Genie 3 is the ultimate AI-powered 3D creation platform."
                : "Genie 3利用先进的AI技术，让每个人都能轻松创建属于自己的3D虚拟世界。从简单的文本描述到复杂的虚拟环境，Genie 3让创意变为现实。Genie 3是终极的AI驱动3D创作平台。"
              }
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {isEnglish ? "Quick Links" : "快速链接"}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  {isEnglish ? "Home" : "首页"}
                </Link>
              </li>
              <li>
                <Link href="/generator" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  {isEnglish ? "World Generator" : "世界生成器"}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  {isEnglish ? "About Us" : "关于我们"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Help Center */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {isEnglish ? "Help Center" : "帮助中心"}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  {isEnglish ? "Terms of Service" : "服务条款"}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  {isEnglish ? "Privacy Policy" : "隐私政策"}
                </Link>
              </li>
              <li>
                <button 
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  onClick={() => {
                    // 触发悬浮帮助按钮的点击事件
                    const helpButton = document.querySelector('[data-help-button]') as HTMLElement;
                    if (helpButton) {
                      helpButton.click();
                    }
                  }}
                >
                  {isEnglish ? "Contact Us" : "联系我们"}
                </button>
              </li>
            </ul>
          </div>

          {/* Friends Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {isEnglish ? "Friends & Partners" : "友情链接"}
            </h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://aipediahub.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  AIPediaHub
                </a>
              </li>
              <li>
                <a 
                  href="https://www.aitoolgo.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  AiToolGo
                </a>
              </li>
              <li>
                <a 
                  href="https://nav-ai.net/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Nav - AI
                </a>
              </li>
            </ul>
          </div>
        </div>



        {/* Bottom Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © 2024 Genie 3. {isEnglish ? "All rights reserved." : "保留所有权利。"}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/terms" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm transition-colors">
                {isEnglish ? "Terms" : "条款"}
              </Link>
              <Link href="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm transition-colors">
                {isEnglish ? "Privacy" : "隐私"}
              </Link>
              <Link href="/pricing" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm transition-colors">
                {isEnglish ? "Pricing" : "定价"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}