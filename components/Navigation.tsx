'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Globe, ChevronDown, User, LogOut, Sun, Moon, CreditCard } from 'lucide-react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Language, languageConfig, detectBrowserLanguage, getTranslations } from '@/lib/translations';
import LoginModal from '@/components/LoginModal';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const { user, signOut, userProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // 初始化时从本地存储读取语言设置，如果没有则检测浏览器语言
  useEffect(() => {
    const savedLanguage = localStorage.getItem('genie3-language') as Language;
    if (savedLanguage && languageConfig[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    } else {
      // 检测浏览器语言
      const detectedLanguage = detectBrowserLanguage();
      setCurrentLanguage(detectedLanguage);
      localStorage.setItem('genie3-language', detectedLanguage);
    }
  }, []);

  // 监听语言切换事件
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      setCurrentLanguage(event.detail.language);
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    
    // 保存语言选择到本地存储
    localStorage.setItem('genie3-language', language);
    
    // 触发自定义事件，通知其他组件语言已切换
    window.dispatchEvent(new CustomEvent('languageChange', {
      detail: { language }
    }));
  };

  const translations = getTranslations(currentLanguage);

  // 格式化积分显示
  const formatCredits = (credits: number) => {
    return credits.toLocaleString();
  };

  const navItems = [
    { href: "/", label: translations?.nav?.home || "Home" },
    { href: "/generator", label: translations?.nav?.generator || "Generator" },
    { href: "/cases", label: translations?.nav?.cases || "Cases" },
    { href: "/pricing", label: translations?.nav?.pricing || "Pricing" },
    { href: "/about", label: translations?.nav?.about || "About" },
  ];

  // 开发环境下添加测试页面链接
  if (process.env.NODE_ENV === 'development') {
    navItems.push({ href: "/test-credits", label: "积分测试" });
  }

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 relative">
              <Image 
                src="/images/logo.webp" 
                alt="Genie 3 Logo" 
                width={32} 
                height={32}
                className="rounded-lg"
                priority
                sizes="(max-width: 640px) 24px, 32px"
              />
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Genie 3</span>
          </Link>

          {/* Desktop Navigation - 放在中间 */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href} 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* 右侧按钮组 */}
          <div className="hidden md:flex items-center space-x-4">
            {/* 主题切换按钮 */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleTheme}
              className="w-10 h-10 p-0 rounded-full border-gray-300 hover:border-blue-500 hover:text-blue-600 focus:outline-none focus:ring-0 focus:border-gray-300 transition-all duration-200"
              title={currentLanguage === 'zh' ? (theme === 'dark' ? '切换到浅色模式' : '切换到深色模式') : (theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode')}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </Button>
            
            {/* 语言选择下拉菜单 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-10 h-10 p-0 rounded-full border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600 transition-all duration-200"
                >
                  <Globe size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-1"
                sideOffset={8}
              >
                {Object.entries(languageConfig).map(([code, config]) => (
                  <DropdownMenuItem 
                    key={code}
                    onClick={() => setLanguage(code as Language)}
                    className={`cursor-pointer rounded-md px-3 py-2 text-sm transition-colors flex items-center space-x-2 ${
                      currentLanguage === code 
                        ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400" 
                        : "hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <span className="text-lg">{config.flag}</span>
                    <span className="font-medium">{config.nativeName}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* 用户头像下拉菜单或开始创作按钮 */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-10 h-10 p-0 rounded-full border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600 transition-all duration-200 overflow-hidden bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold"
                  >
                    {(user.user_metadata?.full_name || user.email || 'U').charAt(0).toUpperCase()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-1"
                  sideOffset={8}
                >
                  {/* User Info Section */}
                  <div className="px-3 py-3 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
                        {(user.user_metadata?.full_name || user.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {user.user_metadata?.full_name || (currentLanguage === 'zh' ? "用户" : "User")}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    
                    {/* 积分显示 */}
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-4 h-4 text-green-600" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {currentLanguage === 'zh' ? '积分余额' : 'Credits'}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {formatCredits(userProfile?.current_credits || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenuItem asChild className="cursor-pointer rounded-md px-3 py-2 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                    <Link href="/profile" className="flex items-center space-x-2">
                      <User size={16} />
                      <span className="font-medium">{currentLanguage === 'zh' ? "个人空间" : "Profile"}</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  {/* 管理订阅按钮 - 只对订阅用户显示 */}
                  {userProfile?.plan_status === 'active' && (
                    <DropdownMenuItem 
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/stripe/create-portal-session', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              customerEmail: user.email,
                              returnUrl: window.location.origin + '/profile'
                            }),
                          });
                          
                          if (response.ok) {
                            const { url } = await response.json();
                            window.location.href = url;
                          } else {
                            console.error('Failed to create portal session');
                          }
                        } catch (error) {
                          console.error('Error creating portal session:', error);
                        }
                      }}
                      className="cursor-pointer rounded-md px-3 py-2 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <CreditCard size={16} />
                      <span className="font-medium">{translations.profile.manageSubscription || "Manage Subscription"}</span>
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={signOut}
                    className="cursor-pointer rounded-md px-3 py-2 text-sm transition-colors hover:bg-gray-50 dark:hover:text-red-300"
                  >
                    <LogOut size={16} className="mr-2" />
                    <span className="font-medium">{currentLanguage === 'zh' ? "退出" : "Sign Out"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                {/* 登录按钮 */}
                <Button 
                  variant="outline" 
                  className="border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 text-sm sm:text-base"
                  onClick={() => setShowLoginModal(true)}
                >
                  <span className="truncate">{currentLanguage === 'zh' ? "登录" : "Sign In"}</span>
                </Button>
                
                {/* 开始创作按钮 */}
                <Button asChild className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base">
                  <Link href="/generator" className="truncate">{currentLanguage === 'zh' ? "开始创作" : "Start Creating"}</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button and controls */}
          <div className="md:hidden flex items-center space-x-2">
            {/* 移动端主题切换按钮 */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleTheme}
              className="w-10 h-10 p-0 rounded-full border-gray-300 hover:border-blue-500 hover:text-blue-600 focus:outline-none focus:ring-0 focus:border-gray-300 transition-all duration-200"
              title={currentLanguage === 'zh' ? (theme === 'dark' ? '切换到浅色模式' : '切换到深色模式') : (theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode')}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </Button>
            
            {/* 移动端语言切换按钮 */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // 循环切换语言
                const languages = Object.keys(languageConfig) as Language[];
                const currentIndex = languages.indexOf(currentLanguage);
                const nextIndex = (currentIndex + 1) % languages.length;
                setLanguage(languages[nextIndex]);
              }}
              className="w-10 h-10 p-0 rounded-full border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600 transition-all duration-200"
              title={currentLanguage === 'zh' ? '切换语言' : 'Switch Language'}
            >
              <Globe size={16} />
            </Button>
            
            {/* 移动端菜单按钮 */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center space-y-1">
                {navItems.map((item) => (
                  <Link 
                    key={item.href} 
                    href={item.href} 
                    className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-center text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              
              {/* 移动端用户信息 */}
              {user && (
                <div className="pt-3 pb-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="px-3 py-2 text-center">
                    <div className="flex flex-col items-center space-y-2 mb-2">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-xs">
                        {(user.user_metadata?.full_name || user.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="text-center">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          {user.user_metadata?.full_name || (currentLanguage === 'zh' ? "用户" : "User")}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    
                    {/* 移动端积分显示 */}
                    <div className="flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 mb-2">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {currentLanguage === 'zh' ? '积分余额' : 'Credits'}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white ml-2">
                        {formatCredits(userProfile?.current_credits || 0)}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <Link 
                        href="/profile" 
                        className="flex items-center justify-center space-x-2 px-3 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 w-full"
                        onClick={() => setIsOpen(false)}
                      >
                        <User size={14} className="flex-shrink-0" />
                        <span className="truncate">{currentLanguage === 'zh' ? "个人空间" : "Profile"}</span>
                      </Link>
                      
                      {/* 移动端管理订阅按钮 - 只对订阅用户显示 */}
                      {userProfile?.plan_status === 'active' && (
                        <button
                          onClick={async () => {
                            setIsOpen(false);
                            try {
                              const response = await fetch('/api/stripe/create-portal-session', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  customerEmail: user.email,
                                  returnUrl: window.location.origin + '/profile'
                                }),
                              });
                              
                              if (response.ok) {
                                const { url } = await response.json();
                                window.location.href = url;
                              } else {
                                console.error('Failed to create portal session');
                              }
                            } catch (error) {
                              console.error('Error creating portal session:', error);
                            }
                          }}
                          className="flex items-center justify-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 w-full"
                        >
                          <CreditCard size={16} className="flex-shrink-0" />
                          <span className="truncate">{translations.profile.manageSubscription || "Manage Subscription"}</span>
                        </button>
                      )}
                      
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          signOut();
                        }}
                        className="flex items-center justify-center space-x-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
                      >
                        <LogOut size={16} className="flex-shrink-0" />
                        <span className="truncate">{currentLanguage === 'zh' ? "退出" : "Sign Out"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {!user && (
                <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                    onClick={() => {
                      setShowLoginModal(true);
                      setIsOpen(false);
                    }}
                  >
                    {currentLanguage === 'zh' ? "登录" : "Sign In"}
                  </Button>
                  <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300">
                    <Link href="/generator" onClick={() => setIsOpen(false)}>
                      {currentLanguage === 'zh' ? "开始创作" : "Start Creating"}
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onSuccess={() => setShowLoginModal(false)}
      />
    </nav>
  );
}