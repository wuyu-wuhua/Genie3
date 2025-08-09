'use client';

import Link from 'next/link';
import { Sparkles, Github, Mail, Twitter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getTranslations, Language, detectBrowserLanguage } from '@/lib/translations';

export default function Footer() {
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
              {translations.footer.description}
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
              {translations.footer.quickLinksTitle}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  {translations.footer.home}
                </Link>
              </li>
              <li>
                <Link href="/generator" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  {translations.footer.worldGenerator}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  {translations.footer.aboutUs}
                </Link>
              </li>
            </ul>
          </div>

          {/* Help Center */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {translations.footer.helpCenterTitle}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  {translations.footer.termsOfService}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  {translations.footer.privacyPolicy}
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
                  {translations.footer.contactUs}
                </button>
              </li>
            </ul>
          </div>

          {/* Friends Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {translations.footer.friendsAndPartnersTitle}
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
              <li>
                <a 
                  href="https://mossai.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="MossAI Tools Directory"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  MossAI Tools Directory
                </a>
              </li>
            </ul>
          </div>
        </div>



        {/* Bottom Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © 2025 Genie 3. {translations.footer.allRightsReserved}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/terms" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm transition-colors">
                {translations.footer.terms}
              </Link>
              <Link href="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm transition-colors">
                {translations.footer.privacy}
              </Link>
              <Link href="/pricing" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm transition-colors">
                {translations.footer.pricing}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}