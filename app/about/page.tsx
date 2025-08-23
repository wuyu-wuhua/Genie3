'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Target, 
  Users, 
  Zap, 
  Globe, 
  ArrowRight,
  Brain,
  Eye,
  Layers,
  Rocket,
  Languages
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { getTranslations, Language } from '@/lib/translations';

export default function AboutPage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  // 初始化时从本地存储读取语言设置，如果没有则检测浏览器语言
  useEffect(() => {
    const savedLanguage = localStorage.getItem('genie3-language') as Language;
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    } else {
      // 检测浏览器语言
      const { detectBrowserLanguage } = require('@/lib/translations');
      const detectedLanguage = detectBrowserLanguage();
      setCurrentLanguage(detectedLanguage);
      localStorage.setItem('genie3-language', detectedLanguage);
    }

    const handleLanguageChange = (event: CustomEvent) => {
      setCurrentLanguage(event.detail.language);
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []);

  const translations = getTranslations(currentLanguage) as any;

  // 添加安全检查，确保翻译对象存在
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: translations?.about?.technology?.genie3AdvancedAI || 'Genie 3 Advanced AI Technology',
      description: translations?.about?.technology?.genie3AdvancedAIDescription || 'Genie 3 is based on the latest artificial intelligence and machine learning technology, capable of understanding complex text descriptions and converting them into 3D scenes'
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: translations?.about?.technology?.genie3RealTimeRendering || 'Genie 3 Real-time Rendering',
      description: translations?.about?.technology?.genie3RealTimeRenderingDescription || 'Genie 3 uses WebGL and Three.js technology to achieve high-quality real-time 3D rendering effects in the browser'
    },
    {
      icon: <Layers className="w-8 h-8" />,
      title: translations?.about?.technology?.genie3ProceduralGeneration || 'Genie 3 Procedural Generation',
      description: translations?.about?.technology?.genie3ProceduralGenerationDescription || 'Genie 3 uses procedural generation algorithms to create unlimited virtual worlds, each generation has unique effects'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: translations?.about?.technology?.genie3CrossPlatformSupport || 'Genie 3 Cross-platform Support',
      description: translations?.about?.technology?.genie3CrossPlatformSupportDescription || 'Genie 3 is completely web-based technology, supporting execution in any modern browser without installing additional software'
    }
  ];

  const timeline = [
    {
      phase: translations?.about?.timeline?.genie3ProofOfConcept || 'Genie 3 Proof of Concept',
      status: translations?.about?.timeline?.currentPhase || 'Current Phase',
      description: translations?.about?.timeline?.genie3ProofOfConceptDescription || 'Verify the feasibility of Genie 3 AI-generated 3D worlds, develop basic prototypes'
    },
    {
      phase: translations?.about?.timeline?.genie3FeatureExpansion || 'Genie 3 Feature Expansion',
      status: translations?.about?.timeline?.inDevelopment || 'In Development',
      description: translations?.about?.timeline?.genie3FeatureExpansionDescription || 'Add more terrain types, building styles, and environmental effects to Genie 3'
    },
    {
      phase: translations?.about?.timeline?.genie3InteractionEnhancement || 'Genie 3 Interaction Enhancement',
      status: translations?.about?.timeline?.planned || 'Planned',
      description: translations?.about?.timeline?.genie3InteractionEnhancementDescription || 'Support more complex user interactions and world editing features in Genie 3'
    },
    {
      phase: translations?.about?.timeline?.genie3AIOptimization || 'Genie 3 AI Optimization',
      status: translations?.about?.timeline?.futurePlan || 'Future Plan',
      description: translations?.about?.timeline?.genie3AIOptimizationDescription || 'Integrate more advanced AI models to improve Genie 3 generation quality and accuracy'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">


      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              {translations?.about?.hero?.title || 'About Genie 3'}
            </h1>
                          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
                {translations?.about?.hero?.subtitle || 'Discover the story behind our AI-powered 3D world generation platform'}
              </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                {translations?.about?.mission?.title || 'Our Mission'}
              </h2>
                              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  {translations?.about?.mission?.description1 || 'Our mission is to democratize 3D world creation, making it accessible to everyone regardless of their technical background or artistic skills.'}
                </p>
                              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  {translations?.about?.mission?.description2 || 'We believe that everyone should have the power to create, explore, and share their own virtual worlds.'}
                </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">10K+</div>
                  <div className="text-gray-600 dark:text-gray-300">{translations?.about?.mission?.stats?.worlds || 'Worlds Created'}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">99%</div>
                  <div className="text-gray-600 dark:text-gray-300">{translations?.about?.mission?.stats?.satisfaction || 'User Satisfaction'}</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 rounded-2xl p-8 h-64 flex items-center justify-center">
                <Rocket className="w-24 h-24 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {translations?.about?.technology?.title || 'Technical Features'}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {translations?.about?.technology?.subtitle || 'We adopt the most advanced technology stack to ensure the best creative experience for users'}
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 dark:bg-gray-800 cursor-pointer group">
                <CardContent className="p-4 text-center space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center text-white mx-auto transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Development Timeline */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {translations?.about?.timeline?.title || 'Development Roadmap'}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {translations?.about?.timeline?.subtitle || 'Our product development plan and future vision'}
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {timeline.map((phase, index) => (
              <Card key={index} className="relative overflow-hidden bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">{phase.phase}</CardTitle>
                    <span className={`px-2 py-1 text-xs rounded-full transition-all duration-300 group-hover:scale-110 ${
                      phase.status === (translations?.about?.timeline?.currentPhase || 'Current Phase')
                        ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' 
                        : phase.status === (translations?.about?.timeline?.inDevelopment || 'In Development')
                        ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300'
                        : phase.status === (translations?.about?.timeline?.planned || 'Planned')
                        ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                    }`}>
                      {phase.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{phase.description}</p>
                </CardContent>
                {index < timeline.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowRight className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-16 bg-amber-50 dark:bg-amber-900/20 border-y border-amber-200 dark:border-amber-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-amber-400 dark:bg-amber-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold">!</span>
            </div>
            <h3 className="text-xl font-semibold text-amber-800 dark:text-amber-300">{translations?.about?.disclaimer?.title || 'Important Notice'}</h3>
          </div>
          <p className="text-amber-700 dark:text-amber-300 text-lg">
            {translations?.about?.disclaimer?.description || 'This platform is currently in development. Some features may not work as expected. We appreciate your patience and feedback as we continue to improve.'}
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            {translations?.about?.cta?.title || 'Ready to Create?'}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {translations?.about?.cta?.subtitle || 'Start building your own 3D worlds today with Genie 3'}
          </p>
          
          <Button asChild size="lg" variant="secondary" className="text-lg px-8">
            <Link href="/generator">
              {translations?.about?.cta?.button || 'Get Started'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}