'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Headphones, X, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Language, detectBrowserLanguage } from '@/lib/translations';

export default function FloatingHelpButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  // 初始化位置到右侧中间
  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // 如果位置未设置，则设置到右侧中间
      if (position.x === 0 && position.y === 0) {
        setPosition({
          x: windowWidth - 60, // 距离右边60px，确保在移动端也能看到
          y: windowHeight / 2 - 20 // 垂直居中，减去按钮高度的一半
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position.x, position.y]);

  // 拖拽功能 - 支持鼠标和触摸
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

  const handleTouchStart = (e: React.TouchEvent) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      setDragOffset({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
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

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault(); // 防止页面滚动
        const touch = e.touches[0];
        const newX = touch.clientX - dragOffset.x;
        const newY = touch.clientY - dragOffset.y;
        
        // 确保按钮不会拖出屏幕
        const maxX = window.innerWidth - 40;
        const maxY = window.innerHeight - 40;
        
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, dragOffset]);

  const handleEmailClick = () => {
    window.open('https://mail.google.com/mail/u/0/?fs=1&to=media@aigenie3.net&su=Problem+Feedback&body=Please+describe+the+problem+you+encountered:&tf=cm', '_blank');
  };


  const content = {
    en: {
      title: "Contact our Customer Service Team",
      description: "If you can't find an answer in the help center, our professional customer service team is always ready to provide support.",
      email: {
        title: "Email Support",
        address: "media@aigenie3.net",
        action: "Open Gmail to compose"
      },
      footer: "Need more help?"
    },
    zh: {
      title: "联系我们的客服团队",
      description: "如果您在帮助中心找不到答案，我们的专业客服团队随时为您提供支持。",
      email: {
        title: "邮件支持",
        address: "media@aigenie3.net",
        action: "打开Gmail撰写邮件"
      },
      footer: "需要更多帮助？"
    },
    ru: {
      title: "Свяжитесь с нашей службой поддержки",
      description: "Если вы не можете найти ответ в справочном центре, наша профессиональная команда поддержки всегда готова помочь.",
      email: {
        title: "Поддержка по email",
        address: "media@aigenie3.net",
        action: "Открыть Gmail для написания"
      },
      footer: "Нужна дополнительная помощь?"
    },
    fr: {
      title: "Contactez notre équipe de service client",
      description: "Si vous ne trouvez pas de réponse dans le centre d'aide, notre équipe de service client professionnelle est toujours prête à vous aider.",
      email: {
        title: "Support par email",
        address: "media@aigenie3.net",
        action: "Ouvrir Gmail pour composer"
      },
      footer: "Besoin d'aide supplémentaire ?"
    },
    ja: {
      title: "カスタマーサービスチームにお問い合わせください",
      description: "ヘルプセンターで答えが見つからない場合、私たちの専門的なカスタマーサービスチームがいつでもサポートを提供する準備ができています。",
      email: {
        title: "メールサポート",
        address: "media@aigenie3.net",
        action: "Gmailを開いて作成"
      },
      footer: "さらにサポートが必要ですか？"
    },
    it: {
      title: "Contatta il nostro team di assistenza clienti",
      description: "Se non riesci a trovare una risposta nel centro assistenza, il nostro team di assistenza clienti professionale è sempre pronto a fornire supporto.",
      email: {
        title: "Supporto via email",
        address: "media@aigenie3.net",
        action: "Apri Gmail per comporre"
      },
      footer: "Hai bisogno di ulteriore aiuto?"
    },
    ko: {
      title: "고객 서비스 팀에 문의하세요",
      description: "도움말 센터에서 답을 찾을 수 없다면, 저희 전문 고객 서비스 팀이 언제든지 지원을 제공할 준비가 되어 있습니다.",
      email: {
        title: "이메일 지원",
        address: "media@aigenie3.net",
        action: "Gmail 열어서 작성"
      },
      footer: "더 많은 도움이 필요하신가요?"
    },
    de: {
      title: "Kontaktieren Sie unser Kundenservice-Team",
      description: "Wenn Sie im Hilfezentrum keine Antwort finden, ist unser professionelles Kundenservice-Team immer bereit, Ihnen zu helfen.",
      email: {
        title: "E-Mail-Support",
        address: "media@aigenie3.net",
        action: "Gmail öffnen zum Verfassen"
      },
      footer: "Benötigen Sie weitere Hilfe?"
    },
    es: {
      title: "Contacta con nuestro equipo de atención al cliente",
      description: "Si no puedes encontrar una respuesta en el centro de ayuda, nuestro equipo profesional de atención al cliente siempre está listo para brindarte apoyo.",
      email: {
        title: "Soporte por email",
        address: "media@aigenie3.net",
        action: "Abrir Gmail para redactar"
      },
      phone: {
        title: "Soporte telefónico",
        number: "+023 6287 2229",
        action: "Días laborables 9:00-18:00"
      },
      footer: "¿Necesitas más ayuda?"
    }
  };

  const currentContent = content[currentLanguage] || content.en;

  return (
    <>
      {/* 悬浮帮助按钮 */}
      <button
        ref={buttonRef}
        onClick={() => !isDragging && setIsOpen(true)}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="fixed z-40 w-10 h-10 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-grab active:cursor-grabbing touch-manipulation"
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

          {/* 对话框 - 在悬浮球左侧，移动端居中显示 */}
          <div 
            className="relative bg-gray-100 dark:bg-gray-800 rounded-xl p-6 max-w-xs w-full mx-4 shadow-2xl border border-gray-300 dark:border-gray-600"
            style={{
              position: 'absolute',
              left: window.innerWidth <= 768 ? '50%' : `${Math.max(16, position.x - 350)}px`, // 移动端居中，桌面端在左侧
              top: window.innerWidth <= 768 ? '50%' : `${position.y - 40}px`, // 移动端居中，桌面端在悬浮球附近
              transform: window.innerWidth <= 768 ? 'translate(-50%, -50%)' : 'translateY(-50%)' // 移动端居中变换
            }}
          >
            {/* 关闭按钮 */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* 标题 */}
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 pr-8">
              {currentContent.title}
            </h2>

            {/* 描述 */}
            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed text-sm">
              {currentContent.description}
            </p>

            {/* 联系方式 */}
            <div className="space-y-4">
              {/* 邮箱 */}
              <div 
                onClick={handleEmailClick}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors p-2 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-400 rounded flex items-center justify-center">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 dark:text-white font-medium text-sm">
                      {currentContent.email.title}
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                      {currentContent.email.address}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                      {currentContent.email.action}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* 底部提示 */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
              <p className="text-gray-500 dark:text-gray-400 text-xs text-center">
                {currentContent.footer}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
