'use client';

import WorldGenerator from '@/components/WorldGenerator';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function GeneratorPage() {
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {isEnglish ? "Genie 3 AI Virtual World Generator" : "Genie 3 AI虚拟世界生成器"}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {isEnglish 
              ? "Genie 3 Online 3D Environment Creation Tool - Create Your Exclusive Virtual World Instantly Through Text Description with Genie 3"
              : "Genie 3在线3D环境创作工具 - 通过Genie 3的文本描述即刻创建您的专属虚拟世界"
            }
          </p>
          <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm">
            <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
            {isEnglish ? "Genie 3 current version is a proof of concept, not a final product" : "Genie 3当前版本为概念验证，非最终产品"}
          </div>
        </div>
      </div>
      
      <WorldGenerator />
    </div>
  );
}