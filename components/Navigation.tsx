'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Sparkles, Languages } from 'lucide-react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEnglish, setIsEnglish] = useState(true);

  const toggleLanguage = () => {
    const newLanguage = !isEnglish;
    setIsEnglish(newLanguage);
    
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
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
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
            {/* 翻译按钮 */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center space-x-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-all duration-200"
            >
              <Languages size={16} />
              <span className="font-medium">{isEnglish ? "中文" : "EN"}</span>
            </Button>
            
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
                  onClick={toggleLanguage}
                  className="w-full flex items-center justify-center space-x-2 border-gray-300 hover:border-blue-500 hover:text-blue-600"
                >
                  <Languages size={16} />
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