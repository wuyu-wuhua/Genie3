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

export default function AboutPage() {
  const [isEnglish, setIsEnglish] = useState(true);

  // 初始化时从本地存储读取语言设置
  useEffect(() => {
    const savedLanguage = localStorage.getItem('genie3-language');
    if (savedLanguage) {
      const isEnglishSaved = savedLanguage === 'en';
      setIsEnglish(isEnglishSaved);
    }

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

  // 翻译文本
  const translations = {
          zh: {
        hero: {
          title: "关于Genie 3 AI虚拟世界生成器",
        subtitle: "我们致力于通过AI技术让3D虚拟世界的创建变得简单易用，让每个人都能成为虚拟世界的建造者"
      },
      mission: {
        title: "我们的使命",
        description1: "传统的3D建模和虚拟世界创建需要专业的技能和昂贵的软件。我们相信，通过AI技术的力量，可以让这个过程变得更加直观和易于接近。",
        description2: "我们的目标是打造一个平台，让用户仅通过文字描述就能创建出令人惊叹的3D虚拟世界，无论是用于游戏开发、教育展示，还是纯粹的创意表达。",
        stats: {
          worlds: "已创建世界",
          satisfaction: "用户满意度"
        }
      },
      technology: {
        title: "技术特色",
        subtitle: "我们采用最前沿的技术栈，确保为用户提供最佳的创作体验"
      },
      timeline: {
        title: "开发路线图",
        subtitle: "我们的产品发展计划和未来愿景"
      },
      disclaimer: {
        title: "重要说明",
        description: "当前版本为概念验证(MVP)阶段，主要用于验证技术可行性和收集用户反馈。产品功能和性能将在后续版本中持续改进和优化。"
      },
      cta: {
        title: "准备开始您的创作之旅吗？",
        subtitle: "体验AI驱动的3D世界生成技术，将您的想象变为现实",
        button: "立即体验生成器"
      }
    },
          en: {
        hero: {
          title: "About Genie 3 AI Virtual World Generator",
        subtitle: "We are committed to making 3D virtual world creation simple and easy to use through AI technology, enabling everyone to become a virtual world builder"
      },
      mission: {
        title: "Our Mission",
        description1: "Traditional 3D modeling and virtual world creation requires professional skills and expensive software. We believe that through the power of AI technology, this process can become more intuitive and accessible.",
        description2: "Our goal is to build a platform where users can create stunning 3D virtual worlds through text descriptions alone, whether for game development, educational display, or pure creative expression.",
        stats: {
          worlds: "Worlds Created",
          satisfaction: "User Satisfaction"
        }
      },
      technology: {
        title: "Technology Features",
        subtitle: "We adopt the most cutting-edge technology stack to ensure the best creative experience for users"
      },
      timeline: {
        title: "Development Roadmap",
        subtitle: "Our product development plan and future vision"
      },
      disclaimer: {
        title: "Important Notice",
        description: "The current version is in the proof-of-concept (MVP) stage, mainly used to verify technical feasibility and collect user feedback. Product features and performance will continue to be improved and optimized in subsequent versions."
      },
      cta: {
        title: "Ready to start your creative journey?",
        subtitle: "Experience AI-driven 3D world generation technology and turn your imagination into reality",
        button: "Try the Generator Now"
      }
    }
  };

  const currentLang = isEnglish ? translations.en : translations.zh;

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: isEnglish ? "Genie 3 Advanced AI Technology" : "Genie 3先进AI技术",
      description: isEnglish 
        ? "Genie 3 based on the latest artificial intelligence and machine learning technology, capable of understanding complex text descriptions and converting them into 3D scenes"
        : "Genie 3基于最新的人工智能和机器学习技术，能够理解复杂的文本描述并转化为3D场景"
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: isEnglish ? "Genie 3 Real-time Rendering" : "Genie 3实时渲染",
      description: isEnglish 
        ? "Genie 3 using WebGL and Three.js technology to achieve high-quality real-time 3D rendering effects in the browser"
        : "Genie 3采用WebGL和Three.js技术，在浏览器中实现高质量的实时3D渲染效果"
    },
    {
      icon: <Layers className="w-8 h-8" />,
      title: isEnglish ? "Genie 3 Procedural Generation" : "Genie 3程序化生成",
      description: isEnglish 
        ? "Genie 3 using procedural generation algorithms to create unlimited virtual worlds, each generation has unique effects"
        : "Genie 3利用程序化生成算法，创造无限可能的虚拟世界，每次生成都有独特的效果"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: isEnglish ? "Genie 3 Cross-platform Support" : "Genie 3跨平台支持",
      description: isEnglish 
        ? "Genie 3 fully web-based technology, supports running in any modern browser without installing additional software"
        : "Genie 3完全基于Web技术，支持在任何现代浏览器中运行，无需安装额外软件"
    }
  ];

  const timeline = [
    {
      phase: isEnglish ? "Genie 3 Proof of Concept" : "Genie 3概念验证",
      status: isEnglish ? "Current Phase" : "当前阶段",
      description: isEnglish 
        ? "Verify the feasibility of Genie 3 AI-generated 3D worlds, develop basic prototypes"
        : "验证Genie 3 AI生成3D世界的可行性，开发基础原型"
    },
    {
      phase: isEnglish ? "Genie 3 Feature Expansion" : "Genie 3功能扩展",
      status: isEnglish ? "In Development" : "开发中",
      description: isEnglish 
        ? "Add more terrain types, building styles, and environmental effects to Genie 3"
        : "为Genie 3添加更多地形类型、建筑样式和环境效果"
    },
    {
      phase: isEnglish ? "Genie 3 Interaction Enhancement" : "Genie 3交互增强",
      status: isEnglish ? "Planned" : "规划中",
      description: isEnglish 
        ? "Support more complex user interactions and world editing features in Genie 3"
        : "在Genie 3中支持更复杂的用户交互和世界编辑功能"
    },
    {
      phase: isEnglish ? "Genie 3 AI Optimization" : "Genie 3 AI优化",
      status: isEnglish ? "Future Plan" : "未来计划",
      description: isEnglish 
        ? "Integrate more advanced AI models to improve Genie 3 generation quality and accuracy"
        : "集成更先进的AI模型，提升Genie 3生成质量和准确度"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">


      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              {isEnglish ? "About Genie 3 AI Virtual World Generator" : "关于Genie 3 AI虚拟世界生成器"}
            </h1>
                          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
                {isEnglish 
                  ? "Genie 3 is committed to making 3D virtual world creation simple and easy to use through AI technology. Genie 3 enables everyone to become a virtual world builder. Genie 3 revolutionizes the way we create digital worlds."
                  : "Genie 3致力于通过AI技术让3D虚拟世界创建变得简单易用。Genie 3让每个人都能成为虚拟世界的建造者。Genie 3革命性地改变了我们创建数字世界的方式。"
                }
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
                {isEnglish ? "Genie 3's Mission" : "Genie 3的使命"}
              </h2>
                              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  {isEnglish 
                    ? "Traditional 3D modeling and virtual world creation requires professional skills and expensive software. We believe that through the power of AI technology, this process can become more intuitive and accessible."
                    : "传统的3D建模和虚拟世界创建需要专业的技能和昂贵的软件。我们相信，通过AI技术的力量，这个过程可以变得更加直观和易于接近。"
                  }
                </p>
                              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  {isEnglish 
                    ? "Genie 3's goal is to build a platform where users can create stunning 3D virtual worlds through text descriptions alone, whether for game development, educational display, or pure creative expression using Genie 3's advanced AI. Genie 3 makes 3D creation accessible to everyone."
                    : "Genie 3的目标是打造一个平台，让用户仅通过文字描述就能创建出令人惊叹的3D虚拟世界，无论是用于游戏开发、教育展示，还是通过Genie 3的先进AI进行纯粹的创意表达。Genie 3让3D创作变得人人可及。"
                  }
                </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">10K+</div>
                  <div className="text-gray-600 dark:text-gray-300">{isEnglish ? "Genie 3 Worlds Created" : "Genie 3已创建世界"}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">99%</div>
                  <div className="text-gray-600 dark:text-gray-300">{isEnglish ? "Genie 3 User Satisfaction" : "Genie 3用户满意度"}</div>
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
              {isEnglish ? "Genie 3's Technology Features" : "Genie 3的技术特色"}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {isEnglish 
                ? "Genie 3 adopts the most cutting-edge technology stack to ensure the best creative experience for users. Genie 3's advanced AI makes 3D creation accessible to everyone. Genie 3 represents the future of AI-powered creativity."
                : "Genie 3采用最前沿的技术栈，确保为用户提供最佳的创作体验。Genie 3的先进AI让3D创作变得人人可及。Genie 3代表了AI驱动创作的未来。"
              }
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
              {isEnglish ? "Genie 3's Development Roadmap" : "Genie 3的开发路线图"}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {isEnglish 
                ? "Genie 3's product development plan and future vision. Genie 3 continues to evolve and improve. Genie 3 is constantly pushing the boundaries of AI-powered 3D creation."
                : "Genie 3的产品发展计划和未来愿景。Genie 3持续发展和改进。Genie 3不断突破AI驱动3D创作的边界。"
              }
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {timeline.map((phase, index) => (
              <Card key={index} className="relative overflow-hidden bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">{phase.phase}</CardTitle>
                    <span className={`px-2 py-1 text-xs rounded-full transition-all duration-300 group-hover:scale-110 ${
                      phase.status === '当前阶段' || phase.status === 'Current Phase'
                        ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' 
                        : phase.status === '开发中' || phase.status === 'In Development'
                        ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300'
                        : phase.status === '规划中' || phase.status === 'Planned'
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
            <h3 className="text-xl font-semibold text-amber-800 dark:text-amber-300">{isEnglish ? "Genie 3 Important Notice" : "Genie 3重要说明"}</h3>
          </div>
          <p className="text-amber-700 dark:text-amber-300 text-lg">
            {isEnglish 
              ? "Genie 3's current version is in the proof-of-concept (MVP) stage, mainly used to verify technical feasibility and collect user feedback. Genie 3's product features and performance will continue to be improved and optimized in subsequent versions. Genie 3 is evolving rapidly."
              : "Genie 3的当前版本为概念验证(MVP)阶段，主要用于验证技术可行性和收集用户反馈。Genie 3的产品功能和性能将在后续版本中持续改进和优化。Genie 3正在快速发展。"
            }
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            {isEnglish ? "Ready to start your Genie 3 creative journey?" : "准备开始您的Genie 3创作之旅吗？"}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {isEnglish ? "Experience Genie 3 AI-driven 3D world generation technology and turn your imagination into reality" : "体验Genie 3 AI驱动的3D世界生成技术，将您的想象变成现实"}
          </p>
          
          <Button asChild size="lg" variant="secondary" className="text-lg px-8">
            <Link href="/generator">
              {isEnglish ? "Try Genie 3 Generator Now" : "立即体验Genie 3生成器"}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}