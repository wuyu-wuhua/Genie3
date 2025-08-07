'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Headphones, X, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FloatingHelpButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEnglish, setIsEnglish] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  // 初始化位置到右侧中间
  useEffect(() => {
    const handleResize = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // 如果位置未设置，则设置到右侧中间
        if (position.x === 0 && position.y === 0) {
          setPosition({
            x: windowWidth - rect.width - 32, // 距离右边32px
            y: windowHeight / 2 - rect.height / 2 // 垂直居中
          });
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position.x, position.y]);

  // 拖拽功能
  const handleMouseDown = (e: React.MouseEvent) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        // 确保按钮不会拖出屏幕
        const maxX = window.innerWidth - 40; // 按钮宽度
        const maxY = window.innerHeight - 40; // 按钮高度
        
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);



  const handleEmailClick = () => {
    window.open('https://mail.google.com/mail/u/0/?pli=1#inbox?compose=new', '_blank');
  };

  const handlePhoneClick = () => {
    window.location.href = 'tel:+02362872229';
  };

  const content = {
    en: {
      title: "Contact our Customer Service Team",
      description: "If you can't find an answer in the help center, our professional customer service team is always ready to provide support.",
      email: {
        title: "Email Support",
        address: "q9425916@gmail.com",
        action: "Open Gmail to compose"
      },
      phone: {
        title: "Phone Support",
        number: "+023 6287 2229",
        action: "Weekdays 9:00-18:00"
      },
      footer: "Need more help?"
    },
    zh: {
      title: "联系我们的客服团队",
      description: "如果您在帮助中心找不到答案，我们的专业客服团队随时为您提供支持。",
      email: {
        title: "邮件支持",
        address: "q9425916@gmail.com",
        action: "打开Gmail撰写邮件"
      },
      phone: {
        title: "电话支持",
        number: "+023 6287 2229",
        action: "工作日 9:00-18:00"
      },
      footer: "需要更多帮助？"
    }
  };

  const currentContent = isEnglish ? content.en : content.zh;

  return (
    <>
      {/* 悬浮帮助按钮 */}
      <button
        ref={buttonRef}
        onClick={() => !isDragging && setIsOpen(true)}
        onMouseDown={handleMouseDown}
        className="fixed z-40 w-10 h-10 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-grab active:cursor-grabbing"
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          transform: isDragging ? 'scale(1.1)' : 'scale(1)'
        }}
        title={currentContent.title}
        data-help-button
      >
        <Headphones className="w-4 h-4" />
      </button>

      {/* 帮助对话框 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 背景遮罩 */}
          <div 
            className="absolute inset-0 bg-gray-200 bg-opacity-50"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* 对话框 - 在悬浮球左侧 */}
          <div 
            className="relative bg-gray-100 rounded-xl p-6 max-w-xs w-full mx-4 shadow-2xl border border-gray-300"
            style={{
              position: 'absolute',
              left: `${Math.max(16, position.x - 350)}px`, // 在悬浮球左侧展开
              top: `${position.y - 40}px`, // 往下移动一点点
              transform: 'translateY(-50%)'
            }}
          >
            {/* 关闭按钮 */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* 标题 */}
            <h2 className="text-xl font-bold text-gray-900 mb-3 pr-8">
              {currentContent.title}
            </h2>

            {/* 描述 */}
            <p className="text-gray-600 mb-4 leading-relaxed text-sm">
              {currentContent.description}
            </p>

            {/* 联系方式 */}
            <div className="space-y-4">
              {/* 邮箱 */}
              <div 
                onClick={handleEmailClick}
                className="cursor-pointer hover:bg-gray-50 transition-colors p-2 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-400 rounded flex items-center justify-center">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 font-medium text-sm">
                      {currentContent.email.title}
                    </h3>
                    <p className="text-blue-600 font-semibold text-sm">
                      {currentContent.email.address}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {currentContent.email.action}
                    </p>
                  </div>
                </div>
              </div>

              {/* 电话 */}
              <div 
                onClick={handlePhoneClick}
                className="cursor-pointer hover:bg-gray-50 transition-colors p-2 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-400 rounded flex items-center justify-center">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 font-medium text-sm">
                      {currentContent.phone.title}
                    </h3>
                    <p className="text-green-600 font-semibold text-sm">
                      {currentContent.phone.number}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {currentContent.phone.action}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 底部提示 */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-gray-500 text-xs text-center">
                {currentContent.footer}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
