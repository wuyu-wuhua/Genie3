'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEnglish, setIsEnglish] = useState(true);

  // 初始化时从本地存储读取语言设置
  useEffect(() => {
    const savedLanguage = localStorage.getItem('genie3-language');
    if (savedLanguage) {
      const isEnglishSaved = savedLanguage === 'en';
      setIsEnglish(isEnglishSaved);
      
      // 触发自定义事件，通知其他组件语言已切换
      window.dispatchEvent(new CustomEvent('languageChange', {
        detail: { isEnglish: isEnglishSaved }
      }));
    }
  }, []);

  const setLanguage = (language: 'en' | 'zh') => {
    const newLanguage = language === 'en';
    setIsEnglish(newLanguage);
    
    // 保存语言选择到本地存储
    localStorage.setItem('genie3-language', language);
    
    // 触发自定义事件，通知其他组件语言已切换
    window.dispatchEvent(new CustomEvent('languageChange', {
      detail: { isEnglish: newLanguage }
    }));
  };

  const navItems = [
    { href: "/", label: isEnglish ? "Home" : "首页" },
    { href: "/generator", label: isEnglish ? "Generator" : "生成器" },
    { href: "/about", label: isEnglish ? "About" : "关于我们" },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 relative">
              <Image 
                src="/images/logo.png" 
                alt="Genie 3 Logo" 
                width={32} 
                height={32}
                className="rounded-lg"
              />
            </div>
            <span className="text-xl font-bold text-gray-900">Genie 3</span>
          </Link>

          {/* Desktop Navigation - 放在中间 */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href} 
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* 右侧按钮组 */}
          <div className="hidden md:flex items-center space-x-4">
            {/* 语言选择下拉菜单 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-10 h-10 p-0 rounded-full border-gray-300 hover:border-blue-500 hover:text-blue-600 focus:outline-none focus:ring-0 focus:border-gray-300 transition-all duration-200"
                >
                  <Globe size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-32 bg-white border border-gray-200 rounded-lg shadow-lg p-1"
                sideOffset={8}
              >
                <DropdownMenuItem 
                  onClick={() => setLanguage('en')}
                  className={`cursor-pointer rounded-md px-3 py-2 text-sm transition-colors ${isEnglish ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                >
                  <span className="font-medium">English</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setLanguage('zh')}
                  className={`cursor-pointer rounded-md px-3 py-2 text-sm transition-colors ${!isEnglish ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                >
                  <span className="font-medium">中文</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* 开始创作按钮 */}
            <Button asChild className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300">
              <Link href="/generator">{isEnglish ? "Start Creating" : "开始创作"}</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* 移动端翻译按钮 */}
              <div className="px-3 py-2">
                <Button 
                  variant="outline" 
                  onClick={() => setLanguage(isEnglish ? 'zh' : 'en')}
                  className="w-full flex items-center justify-center space-x-2 border-gray-300 hover:border-blue-500 hover:text-blue-600"
                >
                  <Globe size={16} />
                  <span className="font-medium">{isEnglish ? "切换到中文" : "Switch to English"}</span>
                </Button>
              </div>
              
              {/* 移动端开始创作按钮 */}
              <div className="px-3 py-2">
                                  <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg">
                    <Link href="/generator" onClick={() => setIsOpen(false)}>
                      {isEnglish ? "Start Creating" : "开始创作"}
                    </Link>
                  </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}