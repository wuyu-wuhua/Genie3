"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { usePayment } from "@/hooks/usePayment";
import { getTranslations, detectBrowserLanguage, Language } from "@/lib/translations";

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  isPopular: boolean;
  creditAmount: number;
  bonusCredits: number;
  sortOrder: number;
  metadata: any;
  features: string[];
  pricing: {
    id: string;
    name: string;
    amount: string;
    currency: string;
    type: string;
    status: string;
    recurringInterval: string;
    recurringIntervalCount: number;
    trialPeriodDays: number;
    stripePriceId: string;
  };
  icon?: string;
  originalPrice?: string;
  savings?: string;
}

interface SubscriptionPlansProps {
  className?: string;
}

export function SubscriptionPlans({ className }: SubscriptionPlansProps) {
  const { user } = useAuth();
  const { createPaymentSession, loading: paymentLoading, error: paymentError, clearError } = usePayment();
  const [selectedPlan, setSelectedPlan] = useState<null | string>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('zh');
  const [translations, setTranslations] = useState(getTranslations('zh'));

  // 初始化时从本地存储读取语言设置，如果没有则检测浏览器语言
  useEffect(() => {
    const savedLanguage = localStorage.getItem('genie3-language') as Language;
    if (savedLanguage && ['zh', 'en', 'ru', 'fr', 'ja', 'it', 'ko', 'de', 'es'].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
      setTranslations(getTranslations(savedLanguage));
    } else {
      // 检测浏览器语言
      try {
        const detectedLang = detectBrowserLanguage();
  
        setCurrentLanguage(detectedLang);
        setTranslations(getTranslations(detectedLang));
        localStorage.setItem('genie3-language', detectedLang);
      } catch (error) {

        // 如果出错，使用默认中文翻译
        setCurrentLanguage('zh');
        setTranslations(getTranslations('zh'));
      }
    }
  }, []);

  // 监听语言切换事件
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      const newLanguage = event.detail.language;

      setCurrentLanguage(newLanguage);
      setTranslations(getTranslations(newLanguage));
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []);

  // 获取默认订阅计划（作为备用）
  const getDefaultPlans = useCallback((): SubscriptionPlan[] => {
    // 确保翻译已加载
    if (!translations?.pricing) {
      return [
        {
          id: "basic-yearly",
          name: '基础版',
          description: "基础世界生成套餐年付",
          type: "basic",
          status: "Active",
          isPopular: false,
          creditAmount: 20000,
          bonusCredits: 0,
          sortOrder: 1,
          metadata: {},
          features: [
            "AI世界生成",
            "5种基础地形类型",
            "简单世界模板库",
            "1080P标准分辨率",
            "基础场景设置工具"
          ],
          pricing: {
            id: "basic-yearly-pricing",
            name: "年付",
            amount: "442.80",
            currency: "USD",
            type: "recurring",
            status: "Active",
            recurringInterval: "month",
            recurringIntervalCount: 1,
            trialPeriodDays: 7,
            stripePriceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_YEARLY_PRICE_ID || "",
          },
          icon: "🌍",
          originalPrice: "442.80",
          savings: "$442.80 年付"
        },
        {
          id: "premium-yearly",
          name: '高级版',
          description: "高级世界生成套餐年付",
          type: "premium",
          status: "Active",
          isPopular: true,
          creditAmount: 50000,
          bonusCredits: 0,
          sortOrder: 2,
          metadata: {},
          features: [
            "AI智能世界生成",
            "20+种高级地形纹理",
            "复杂世界定制生成",
            "4K超高清分辨率",
            "专业场景编辑器"
          ],
          pricing: {
            id: "premium-yearly-pricing",
            name: "年付",
            amount: "838.80",
            currency: "USD",
            type: "recurring",
            status: "Active",
            recurringInterval: "month",
            recurringIntervalCount: 1,
            trialPeriodDays: 7,
            stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_YEARLY_PRICE_ID || "",
          },
          icon: "⭐",
          originalPrice: "838.80",
          savings: "$838.80 年付"
        },
      ];
    }

    
    
    const yearlyPlans: SubscriptionPlan[] = [
      {
        id: "basic-yearly",
        name: translations.pricing.basicPlan || '基础版',
        description: translations.pricing.basicWorldGeneration || "基础世界生成套餐年付",
        type: "basic",
        status: "Active",
        isPopular: false,
        creditAmount: 20000,
        bonusCredits: 0,
        sortOrder: 1,
        metadata: {},
        features: [
          translations.pricing.aiWorldGeneration || "AI世界生成",
          translations.pricing.basicTerrainTextures || "5种基础地形类型",
          translations.pricing.oneClickGeneration || "简单世界模板库",
          translations.pricing.standardResolution || "1080P标准分辨率",
          translations.pricing.basicSceneEditing || "基础场景设置工具"
        ],
        pricing: {
          id: "basic-yearly-pricing",
          name: translations.pricing.annual || "年付",
          amount: "442.80",
          currency: "USD",
          type: "recurring",
          status: "Active",
          recurringInterval: "month",
          recurringIntervalCount: 1,
          trialPeriodDays: 7,
          stripePriceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_YEARLY_PRICE_ID || "",
        },
        icon: "🌍",
        originalPrice: "442.80",
        savings: `$${442.80} ${translations.pricing.billedAnnually || '年付'}`
      },
      {
        id: "premium-yearly",
        name: translations.pricing.proPlan || '高级版',
        description: translations.pricing.advancedWorldGeneration || "高级世界生成套餐年付",
        type: "premium",
        status: "Active",
        isPopular: true,
        creditAmount: 50000,
        bonusCredits: 0,
        sortOrder: 2,
        metadata: {},
        features: [
          translations.pricing.aiWorldGeneration || "AI智能世界生成",
          translations.pricing.advancedTerrainTextures || "20+种高级地形纹理",
          translations.pricing.complexWorldGeneration || "复杂世界定制生成",
          translations.pricing.highResolution4K || "4K超高清分辨率",
          translations.pricing.advancedSceneEditing || "专业场景编辑器"
        ],
        pricing: {
          id: "premium-yearly-pricing",
          name: translations.pricing.annual || "年付",
          amount: "838.80",
          currency: "USD",
          type: "recurring",
          status: "Active",
          recurringInterval: "month",
          recurringIntervalCount: 1,
          trialPeriodDays: 7,
          stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_YEARLY_PRICE_ID || "",
        },
        icon: "⭐",
        originalPrice: "838.80",
        savings: `$${838.80} ${translations.pricing.billedAnnually || '年付'}`
      },
    ];

    // 根据计费周期返回对应的计划
    if (billingCycle === "monthly") {
      return [
        {
          id: "basic-monthly",
          name: translations.pricing.basicPlan || '基础版',
          description: translations.pricing.basicWorldGeneration || "基础世界生成套餐月付",
          type: "basic",
          status: "Active",
          isPopular: false,
          creditAmount: 2000,
          bonusCredits: 0,
          sortOrder: 1,
          metadata: {},
          features: [
            translations.pricing.aiWorldGeneration || "AI世界生成",
            translations.pricing.basicTerrainTextures || "5种基础地形类型",
            translations.pricing.oneClickGeneration || "简单世界模板库",
            translations.pricing.standardResolution || "1080P标准分辨率",
            translations.pricing.basicSceneEditing || "基础场景设置工具"
          ],
          pricing: {
            id: "basic-monthly-pricing",
            name: translations.pricing.monthly || "月付",
            amount: "39.90",
            currency: "USD",
            type: "recurring",
            status: "Active",
            recurringInterval: "month",
            recurringIntervalCount: 1,
            trialPeriodDays: 7,
            stripePriceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PRICE_ID || "",
          },
          icon: "🌍",
          originalPrice: "39.90",
          savings: `$${39.90} ${translations.pricing.monthly || '月付'}`
        },
        {
          id: "premium-monthly",
          name: translations.pricing.proPlan || '高级版',
          description: translations.pricing.advancedWorldGeneration || "高级世界生成套餐月付",
          type: "premium",
          status: "Active",
          isPopular: true,
          creditAmount: 5000,
          bonusCredits: 0,
          sortOrder: 2,
          metadata: {},
          features: [
            translations.pricing.aiWorldGeneration || "AI智能世界生成",
            translations.pricing.advancedTerrainTextures || "20+种高级地形纹理",
            translations.pricing.complexWorldGeneration || "复杂世界定制生成",
            translations.pricing.highResolution4K || "4K超高清分辨率",
            translations.pricing.advancedSceneEditing || "专业场景编辑器"
          ],
          pricing: {
            id: "premium-monthly-pricing",
            name: translations.pricing.monthly || "月付",
            amount: "99.90",
            currency: "USD",
            type: "recurring",
            status: "Active",
            recurringInterval: "month",
            recurringIntervalCount: 1,
            trialPeriodDays: 7,
            stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID || "",
          },
          icon: "⭐",
          originalPrice: "99.90",
          savings: `$${99.90} ${translations.pricing.monthly || '月付'}`
        },
      ];
    }

    return yearlyPlans;
  }, [billingCycle, translations]);

  useEffect(() => {
    if (translations && Object.keys(translations).length > 0) {
      setSubscriptionPlans(getDefaultPlans());
    }
  }, [translations, getDefaultPlans]);

  // 调试：显示当前翻译状态
  useEffect(() => {
    
  }, [currentLanguage, translations]);

  // 当计费周期改变时重新生成套餐
  useEffect(() => {
    
    setSubscriptionPlans(getDefaultPlans());
  }, [billingCycle, translations, getDefaultPlans]);

  // 初始加载
  useEffect(() => {
    
    setSubscriptionPlans(getDefaultPlans());
  }, [translations, getDefaultPlans]);

  const handleSelectPlan = async (plan: SubscriptionPlan) => {
    try {
      if (!user) {

        return;
      }

      setSelectedPlan(plan.id);
      clearError();

      // 使用新的支付Hook创建支付会话
      const session = await createPaymentSession(plan.id, plan.pricing.stripePriceId);
      
      if (session) {

        // 重定向到Stripe结账页面
        window.location.href = session.url;
      } else {

        setSelectedPlan(null);
      }

    } catch (error) {
      
      setSelectedPlan(null);
    }
  };

  // 清除支付错误
  useEffect(() => {
    if (paymentError) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [paymentError, clearError]);

  return (
    <div className={className || ""}>
      {/* 页面标题和用户信息 */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {translations?.pricing?.pageTitle || '选择您的套餐'}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mb-4">
          {translations?.pricing?.pageSubtitle || '升级到付费套餐，获得更多使用次数'}
        </p>
        {user && (
          <p className="text-xs sm:text-sm text-gray-500">
            {translations?.pricing?.currentUser || '当前登录用户'}: {user.email}
          </p>
        )}
      </div>

      {/* 计费周期切换 */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 sm:px-6 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              billingCycle === "monthly"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {translations?.pricing?.monthlyBilling || 'Monthly'}
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-4 sm:px-6 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              billingCycle === "yearly"
                ? "bg-purple-400 text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {translations?.pricing?.yearlyBilling || 'Yearly'}
          </button>
        </div>
      </div>

      {/* 错误提示 */}
      {paymentError && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-xs sm:text-sm">{paymentError.message}</p>
        </div>
      )}

      {/* 订阅计划卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
        {subscriptionPlans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-lg border-2 p-4 sm:p-6 transition-all duration-200 relative ${
              plan.isPopular
                ? "border-purple-400 shadow-lg"
                : "border-gray-200 hover:border-gray-300 hover:shadow-md"
            }`}
          >
            {/* 推荐标签 */}
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-400 text-gray-900 px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                  {translations?.pricing?.recommended || 'Recommended'}
                </span>
              </div>
            )}

            {/* 计划头部 */}
            <div className="text-center mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                {plan.name}
              </h3>
            </div>

            {/* 价格 */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                  ${plan.pricing.amount}
                </span>
                <span className="text-xs sm:text-sm text-gray-500">
                  {translations?.pricing?.perMonthText || 'per month'}
                </span>
              </div>
              {plan.originalPrice && (
                <p className="text-xs sm:text-sm text-gray-500">
                  {plan.savings}
                </p>
              )}
              {/* 积分显示 */}
              <div className="mt-3 p-2 sm:p-3 bg-blue-50 rounded-lg">
                <p className="text-xl sm:text-2xl font-bold text-blue-600">
                  {plan.creditAmount.toLocaleString()}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  {billingCycle === "monthly" 
                    ? (translations?.pricing?.creditsPerMonth || '积分/月')
                    : (translations?.pricing?.creditsPerYear || '积分/年')
                  }
                </p>
              </div>
            </div>

            {/* 订阅按钮 */}
            <Button
              onClick={() => handleSelectPlan(plan)}
              disabled={paymentLoading || selectedPlan === plan.id}
              className="w-full bg-purple-400 hover:bg-purple-500 text-gray-900 font-semibold py-2 sm:py-3 text-base sm:text-lg"
            >
              {paymentLoading && selectedPlan === plan.id ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm sm:text-base">{translations?.pricing?.processing || '处理中...'}</span>
                </div>
              ) : (
                <span className="text-sm sm:text-base">{translations?.pricing?.subscribe || 'Subscribe'}</span>
              )}
            </Button>

            {/* 功能列表 */}
            <div className="space-y-2 sm:space-y-3 mt-6">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 sm:gap-3">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-700 text-xs sm:text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
