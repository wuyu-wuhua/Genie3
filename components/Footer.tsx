'use client';

import Link from 'next/link';
import { Sparkles, Github, Mail, Twitter } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Footer() {
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

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Genie 3</span>
            </div>
            <p className="text-gray-300 mb-4">
              {isEnglish 
                ? "Genie 3 uses advanced AI technology to enable everyone to easily create their own 3D virtual worlds. From simple text descriptions to complex virtual environments, Genie 3 turns creativity into reality. Genie 3 is the ultimate AI-powered 3D creation platform."
                : "Genie 3利用先进的AI技术，让每个人都能轻松创建属于自己的3D虚拟世界。从简单的文本描述到复杂的虚拟环境，Genie 3让创意变为现实。Genie 3是终极的AI驱动3D创作平台。"
              }
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
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
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  {isEnglish ? "Home" : "首页"}
                </Link>
              </li>
              <li>
                <Link href="/generator" className="text-gray-300 hover:text-white transition-colors">
                  {isEnglish ? "World Generator" : "世界生成器"}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  {isEnglish ? "About Us" : "关于我们"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {isEnglish ? "Legal" : "法律条款"}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                  {isEnglish ? "Terms of Service" : "服务条款"}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  {isEnglish ? "Privacy Policy" : "隐私政策"}
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => {
                    // 触发悬浮帮助按钮的点击事件
                    const helpButton = document.querySelector('[data-help-button]') as HTMLElement;
                    if (helpButton) {
                      helpButton.click();
                    }
                  }}
                  className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  {isEnglish ? "Contact Us" : "联系我们"}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 mb-4">
            {isEnglish 
              ? "© 2025 Genie 3 AI Virtual World Generator. Genie 3 is the leading AI-powered 3D creation tool. All rights reserved. Current version is a proof of concept, not a final product."
              : "© 2025 Genie 3 AI虚拟世界生成器. Genie 3是领先的AI驱动3D创作工具. 保留所有权利. 当前版本为概念验证，非最终产品。"
            }
          </p>
          <p className="text-gray-400">
            {isEnglish ? "Powered by " : "由 "}
            <a href="https://nav-ai.net/" title="Nav - AI" className="text-blue-400 hover:text-blue-300 transition-colors">
              Nav - AI
            </a>
            {isEnglish ? " technology" : " 技术驱动"}
          </p>
        </div>
      </div>
    </footer>
  );
}