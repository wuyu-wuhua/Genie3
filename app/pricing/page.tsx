'use client';

import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function PricingPage() {
  const [isEnglish, setIsEnglish] = useState(true);
  const [isAnnual, setIsAnnual] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('genie3-language');
    if (savedLanguage) {
      setIsEnglish(savedLanguage === 'en');
    }

    const handleLanguageChange = (event: CustomEvent) => {
      setIsEnglish(event.detail.isEnglish);
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []);

  const monthlyPlans = [
    {
      name: isEnglish ? "Monthly Plan 1" : "月订阅1",
      price: "¥39.9",
      credits: "1,300",
      period: isEnglish ? "/month" : "/月",
      description: isEnglish ? "Perfect for beginners" : "适合初学者",
      features: [
        isEnglish ? "1,300 credits per month" : "每月1300积分",
        isEnglish ? "Basic world generation" : "基础世界生成",
        isEnglish ? "Standard support" : "标准支持",
        isEnglish ? "Export in common formats" : "常用格式导出"
      ],
      popular: false
    },
    {
      name: isEnglish ? "Monthly Plan 2" : "月订阅2",
      price: "¥99.9",
      credits: "4,000",
      period: isEnglish ? "/month" : "/月",
      description: isEnglish ? "Most popular choice" : "最受欢迎选择",
      features: [
        isEnglish ? "4,000 credits per month" : "每月4000积分",
        isEnglish ? "Advanced world generation" : "高级世界生成",
        isEnglish ? "Priority support" : "优先支持",
        isEnglish ? "All export formats" : "所有导出格式",
        isEnglish ? "Custom textures" : "自定义纹理"
      ],
      popular: true
    }
  ];

  const annualPlans = [
    {
      name: isEnglish ? "Annual Plan 1" : "年订阅1",
      price: "¥442.8",
      credits: "20,000",
      period: isEnglish ? "/year" : "/年",
      description: isEnglish ? "Best value for creators" : "创作者最佳选择",
      features: [
        isEnglish ? "20,000 credits per year" : "每年2万积分",
        isEnglish ? "All world generation features" : "所有世界生成功能",
        isEnglish ? "Premium support" : "高级支持",
        isEnglish ? "Unlimited exports" : "无限导出",
        isEnglish ? "Custom assets library" : "自定义资源库",
        isEnglish ? "2 months free" : "免费2个月"
      ],
      popular: false
    },
    {
      name: isEnglish ? "Annual Plan 2" : "年订阅2",
      price: "¥838.8",
      credits: "50,000",
      period: isEnglish ? "/year" : "/年",
      description: isEnglish ? "For power users" : "适合专业用户",
      features: [
        isEnglish ? "50,000 credits per year" : "每年5万积分",
        isEnglish ? "All premium features" : "所有高级功能",
        isEnglish ? "24/7 priority support" : "24/7优先支持",
        isEnglish ? "Unlimited everything" : "无限使用",
        isEnglish ? "Exclusive assets" : "专属资源",
        isEnglish ? "API access" : "API访问",
        isEnglish ? "3 months free" : "免费3个月"
      ],
      popular: false
    }
  ];

  const pricingPlans = isAnnual ? annualPlans : monthlyPlans;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {isEnglish ? "Choose Your Plan" : "选择您的套餐"}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {isEnglish 
              ? "Unlock the power of AI-driven 3D world generation with our flexible pricing plans" 
              : "通过我们灵活的定价套餐，解锁AI驱动的3D世界生成能力"
            }
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`text-lg font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
              {isEnglish ? "Monthly" : "月订阅"}
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isAnnual ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-lg font-medium ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
              {isEnglish ? "Annual" : "年订阅"}
            </span>
            {isAnnual && (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                {isEnglish ? "Save up to 20%" : "节省高达20%"}
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative transition-all duration-300 hover:shadow-xl ${
                plan.popular 
                  ? 'border-2 border-blue-500 shadow-lg scale-105' 
                  : 'border border-gray-200 hover:border-blue-300'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white">
                  {isEnglish ? "Most Popular" : "最受欢迎"}
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold text-gray-900">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Price */}
                <div className="text-center">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-1">{plan.period}</span>
                  </div>
                  <p className="text-lg text-gray-700 mt-2">
                    {plan.credits} {isEnglish ? "credits" : "积分"}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600' 
                      : 'bg-gray-900 hover:bg-gray-800'
                  } text-white font-semibold py-3`}
                >
                  {isEnglish ? "Get Started" : "立即开始"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            {isEnglish ? "Frequently Asked Questions" : "常见问题"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {isEnglish ? "What are credits?" : "什么是积分？"}
              </h3>
              <p className="text-gray-600">
                {isEnglish 
                  ? "Credits are used to generate 3D worlds. Each world generation consumes a certain number of credits based on complexity." 
                  : "积分用于生成3D世界。每次世界生成会根据复杂度消耗一定数量的积分。"
                }
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {isEnglish ? "Can I change plans?" : "我可以更换套餐吗？"}
              </h3>
              <p className="text-gray-600">
                {isEnglish 
                  ? "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately." 
                  : "是的，您可以随时升级或降级套餐。更改立即生效。"
                }
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {isEnglish ? "Do credits expire?" : "积分会过期吗？"}
              </h3>
              <p className="text-gray-600">
                {isEnglish 
                  ? "Monthly credits expire at the end of each month. Annual credits are valid for the full year." 
                  : "月套餐积分在每月底过期。年套餐积分在全年内有效。"
                }
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {isEnglish ? "What payment methods?" : "支持哪些支付方式？"}
              </h3>
              <p className="text-gray-600">
                {isEnglish 
                  ? "We accept all major credit cards, PayPal, and Alipay for your convenience." 
                  : "我们支持所有主要信用卡、PayPal和支付宝，方便您支付。"
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 