'use client';

import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getTranslations, Language, detectBrowserLanguage } from '@/lib/translations';

export default function PricingPage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [isAnnual, setIsAnnual] = useState(false);

  // 初始化时从本地存储读取语言设置，如果没有则检测浏览器语言
  useEffect(() => {
    const savedLanguage = localStorage.getItem('genie3-language') as Language;
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    } else {
      // 检测浏览器语言
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

  const translations = getTranslations(currentLanguage);

  const monthlyPlans = [
    {
      name: translations.pricing?.basicWorldGeneration || "Basic World Generation",
      price: "¥39.9",
      credits: "1,300",
      period: translations.pricing?.perMonth || "/month",
      description: translations.pricing?.perfectForBeginners || "Perfect for beginners",
      features: [
        translations.pricing?.creditsPerMonth?.replace('{credits}', '1,300') || "1,300 credits per month",
        translations.pricing?.basicWorldGeneration || "Basic world generation",
        translations.pricing?.standardSupport || "Standard support",
        translations.pricing?.exportInCommonFormats || "Export in common formats"
      ],
      popular: false
    },
    {
      name: translations.pricing?.advancedWorldGeneration || "Advanced World Generation",
      price: "¥99.9",
      credits: "4,000",
      period: translations.pricing?.perMonth || "/month",
      description: translations.pricing?.mostPopularChoice || "Most popular choice",
      features: [
        translations.pricing?.creditsPerMonth?.replace('{credits}', '4,000') || "4,000 credits per month",
        translations.pricing?.advancedWorldGeneration || "Advanced world generation",
        translations.pricing?.prioritySupport || "Priority support",
        translations.pricing?.allExportFormats || "All export formats",
        translations.pricing?.customTextures || "Custom textures"
      ],
      popular: true
    }
  ];

  const annualPlans = [
    {
      name: translations.pricing?.allWorldGenerationFeatures || "All World Generation Features",
      price: "¥442.8",
      credits: "20,000",
      period: translations.pricing?.perYear || "/year",
      description: translations.pricing?.bestValueForCreators || "Best value for creators",
      features: [
        translations.pricing?.creditsPerYear?.replace('{credits}', '20,000') || "20,000 credits per year",
        translations.pricing?.allWorldGenerationFeatures || "All world generation features",
        translations.pricing?.premiumSupport || "Premium support",
        translations.pricing?.unlimitedExports || "Unlimited exports",
        translations.pricing?.customAssetsLibrary || "Custom assets library",
        translations.pricing?.monthsFree?.replace('{months}', '2') || "2 months free"
      ],
      popular: false
    },
    {
      name: translations.pricing?.allPremiumFeatures || "All Premium Features",
      price: "¥838.8",
      credits: "50,000",
      period: translations.pricing?.perYear || "/year",
      description: translations.pricing?.forPowerUsers || "For power users",
      features: [
        translations.pricing?.creditsPerYear?.replace('{credits}', '50,000') || "50,000 credits per year",
        translations.pricing?.allPremiumFeatures || "All premium features",
        translations.pricing?.prioritySupport247 || "24/7 priority support",
        translations.pricing?.unlimitedEverything || "Unlimited everything",
        translations.pricing?.exclusiveAssets || "Exclusive assets",
        translations.pricing?.apiAccess || "API access",
        translations.pricing?.monthsFree?.replace('{months}', '3') || "3 months free"
      ],
      popular: false
    }
  ];

  const pricingPlans = isAnnual ? annualPlans : monthlyPlans;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {translations.pricing?.title || "Genie 3 Pricing Plans"}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            {translations.pricing?.subtitle || "Choose the perfect plan for your creative needs"}
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
              {translations.pricing?.monthly || "Monthly"}
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isAnnual ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
              {translations.pricing?.annual || "Annual"}
            </span>
            {isAnnual && (
              <Badge className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">
                {translations.pricing?.save || "Save"}
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative bg-white dark:bg-gray-800 border-2 transition-all duration-200 hover:shadow-lg ${
                plan.popular 
                  ? 'border-blue-500 dark:border-blue-400 shadow-lg scale-105' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 dark:bg-blue-500 text-white px-3 py-1">
                    {translations.pricing?.popular || "Most Popular"}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-lg text-gray-500 dark:text-gray-400 ml-1">
                      {plan.period}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {plan.credits} {translations.pricing?.creditsPerMonth || "credits per month"}
                  </p>
                </div>
                
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600' 
                      : 'bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600'
                  } text-white`}
                >
                  {translations.pricing?.choosePlan || "Choose Plan"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {translations.pricing?.startFreeTrial || "Start Free Trial"}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {translations.pricing?.contactSales || "Contact Sales"}
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
          >
            {translations.pricing?.startFreeTrial || "Start Free Trial"}
          </Button>
        </div>
      </div>
    </div>
  );
} 