'use client';

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { getTranslations, Language, detectBrowserLanguage } from "@/lib/translations";
import { 
  User, 
  CreditCard, 
  Settings, 
  RefreshCw,
  Crown,
  Sparkles,
  Shield,
  LogOut
} from "lucide-react";

export default function ProfilePage() {
  const { user, userProfile, session, refreshUserProfile, manualSyncUserData, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('zh');
  const [translations, setTranslations] = useState(getTranslations('zh'));

  // 格式化积分显示
  const formatCredits = (credits: number) => {
    return credits.toLocaleString();
  };

  // 手动同步用户数据
  const handleManualSync = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const result = await manualSyncUserData();
      if (result?.success) {
        await refreshUserProfile();
      }
    } catch (error) {
      console.error(translations.profile.syncFailed, error);
    } finally {
      setIsLoading(false);
    }
  };

  // 检测浏览器语言和监听语言变化
  useEffect(() => {
    // 初始化时从本地存储读取语言设置，如果没有则检测浏览器语言
    const savedLanguage = localStorage.getItem('genie3-language') as Language;
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
      setTranslations(getTranslations(savedLanguage));
    } else {
      const detectedLanguage = detectBrowserLanguage();
      setCurrentLanguage(detectedLanguage);
      setTranslations(getTranslations(detectedLanguage));
    }

    // 监听语言切换事件
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-slate-200 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-700">{translations.profile.pleaseLoginFirst}</h2>
          <p className="text-slate-500">{translations.profile.loginToViewProfile}</p>
        </div>
      </div>
    );
  }

  const currentCredits = userProfile?.current_credits || 0;
  const totalEarnedCredits = userProfile?.total_earned_credits || 0;
  const subscriptionStatus = userProfile?.plan_status || 'inactive';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 头部区域 */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">{user.email}</h1>
          <div className="flex items-center justify-center gap-2">
            <Badge variant={subscriptionStatus === 'active' ? 'default' : 'secondary'} className="px-3 py-1">
              {subscriptionStatus === 'active' ? (
                <>
                  <Crown className="w-3 h-3 mr-1" />
                  {translations.profile.premiumMember}
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 mr-1" />
                  {translations.profile.freeUser}
                </>
              )}
            </Badge>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：用户信息 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 积分卡片 */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">{translations.profile.creditBalance}</h3>
                      <p className="text-sm text-slate-500">{translations.profile.currentAvailableCredits}</p>
                    </div>
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-2">
                  {formatCredits(currentCredits)}
                </div>
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>{translations.profile.totalEarnedCredits}: {formatCredits(totalEarnedCredits)}</span>
                  <span>{translations.profile.usedCredits}: {formatCredits(totalEarnedCredits - currentCredits)}</span>
                </div>
              </CardContent>
            </Card>

            {/* 账户信息 */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">{translations.profile.accountInfo}</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600">{translations.profile.userID}</span>
                    <span className="text-slate-800 font-mono text-sm">{user.id}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600">{translations.profile.emailAddress}</span>
                    <span className="text-slate-800">{user.email}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600">{translations.profile.registrationTime}</span>
                    <span className="text-slate-800">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString(currentLanguage === 'zh' ? 'zh-CN' : 'en-US') : translations.profile.unknown}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：操作区域 */}
          <div className="space-y-6">
            {/* 快速操作 */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">{translations.profile.quickActions}</h3>
                <div className="space-y-3">
                  <Button 
                    onClick={handleManualSync} 
                    variant="outline" 
                    className="w-full justify-start h-11 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    disabled={isLoading}
                  >
                    <RefreshCw className={`w-4 h-4 mr-3 ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? translations.profile.syncing : translations.profile.syncData}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-11 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    {translations.profile.accountSettings}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 会员状态 */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Crown className="w-5 h-5 text-amber-600" />
                  <h3 className="text-lg font-semibold text-amber-800">{translations.profile.memberStatus}</h3>
                </div>
                <p className="text-sm text-amber-700 mb-4">
                  {subscriptionStatus === 'active' 
                    ? translations.profile.premiumMemberDescription
                    : translations.profile.upgradeToPremium}
                </p>
                <Button 
                  variant="default" 
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                >
                  {subscriptionStatus === 'active' ? translations.profile.manageSubscription : translations.profile.upgradeMembership}
                </Button>
              </CardContent>
            </Card>

            {/* 退出登录 */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <Button 
                  onClick={signOut}
                  variant="ghost" 
                  className="w-full justify-start h-11 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  {translations.profile.signOut}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 