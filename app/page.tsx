'use client';

import Hero from '@/components/Hero';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { UserReviews } from '@/components/UserReviews';
import { Features } from '@/components/Features';
import { getTranslations, Language } from "@/lib/translations";
import { 
  Zap, 
  Palette, 
  Globe, 
  Users, 
  ArrowRight, 
  Check,
  Sparkles,
  Brain,
  Eye,
  Layers,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function Home() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
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

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const currentLanguage: Language = isEnglish ? 'en' : 'zh';
  const translations = getTranslations(currentLanguage);

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: translations.home.features.features[0].title,
      description: translations.home.features.features[0].description
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: translations.home.features.features[1].title,
      description: translations.home.features.features[1].description
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: translations.home.features.features[2].title,
      description: translations.home.features.features[2].description
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: translations.home.features.features[3].title,
      description: translations.home.features.features[3].description
    }
  ];

  return (
    <div>
      <Hero />
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {translations.home.features.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {translations.home.features.subtitle}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center text-white mx-auto">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* User Reviews Section */}
      <UserReviews />

      {/* Examples Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {translations.home.examples.title}
            </h2>
            <p className="text-xl text-gray-600">
              {translations.home.examples.subtitle}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {translations.home.examples.examples.map((example, index) => (
              <Card key={index} className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-700 italic mb-4">&ldquo;{example}&rdquo;</p>
                      <Button variant="outline" size="sm">
                        {translations.home.examples.cta}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600">
              <Link href="/generator">
                {translations.home.examples.cta}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full mb-6">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {translations.home.faq.title}
            </h2>
            <p className="text-xl text-gray-600">
              {translations.home.faq.subtitle}
            </p>
          </div>
          
          <div className="space-y-4">
            {translations.home.faq.faqs.map((faq, index) => (
              <Card key={index} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                    {openFAQ === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  {openFAQ === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
                               <Button 
                     variant="outline" 
                     size="lg" 
                     className="text-lg px-8"
                     onClick={() => {
                       // 触发悬浮帮助按钮的点击事件
                       const helpButton = document.querySelector('[data-help-button]') as HTMLElement;
                       if (helpButton) {
                         helpButton.click();
                       }
                     }}
                   >
                     {translations.home.faq.contact}
                     <ArrowRight className="ml-2 w-5 h-5" />
                   </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            {translations.home.cta.title}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {translations.home.cta.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8">
              <Link href="/generator">
                {translations.home.cta.primary}
              </Link>
            </Button>
            <Button asChild size="lg" className="text-lg px-8 border-2 border-white bg-transparent text-white hover:bg-white hover:text-blue-600">
              <Link href="/about">
                {translations.home.cta.secondary}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}