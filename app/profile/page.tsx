'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Settings, History, Star, Download } from 'lucide-react';
import Image from 'next/image';
import { getTranslations, Language, detectBrowserLanguage } from '@/lib/translations';

export default function ProfilePage() {
  const { user } = useAuth();
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white dark:text-white mb-4">
            {translations.profile?.pleaseLogin || "Please log in to view your profile"}
          </h1>
          <Button asChild className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600">
            <a href="/generator">{translations.profile?.goToLogin || "Go to Login"}</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              {user.user_metadata?.avatar_url ? (
                <Image 
                  src={user.user_metadata.avatar_url} 
                  alt="User Avatar" 
                  width={120} 
                  height={120}
                  className="rounded-full border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-30 h-30 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center border-4 border-white shadow-lg">
                  <User size={60} className="text-white" />
                </div>
              )}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {user.user_metadata?.full_name || user.email || (translations.profile?.user || "User")}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{user.email}</p>
          <div className="flex justify-center space-x-4">
            <Badge className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
              {translations.profile?.activeUser || "Active User"}
            </Badge>
            <Badge className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">
              {translations.profile?.premium || "Premium"}
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <History className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{translations.profile?.worldsCreated || "Worlds Created"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                  <Star className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">156</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{translations.profile?.totalLikes || "Total Likes"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                  <Download className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">89</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{translations.profile?.downloads || "Downloads"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                  <Settings className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{translations.profile?.templates || "Templates"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-white dark:bg-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              {translations.profile?.recentActivity || "Recent Activity"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {translations.profile?.createdWorld || "Created a new world"} - {translations.profile?.mountainLandscape || "Mountain Landscape"}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">2 {translations.profile?.hoursAgo || "hours ago"}</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {translations.profile?.receivedLike || "Received a like"} - {translations.profile?.oceanScene || "Ocean Scene"}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">5 {translations.profile?.hoursAgo || "hours ago"}</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {translations.profile?.downloadedTemplate || "Downloaded template"} - {translations.profile?.forestTemplate || "Forest Template"}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">1 {translations.profile?.dayAgo || "day ago"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Section */}
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              {translations.profile?.accountSettings || "Account Settings"}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {translations.profile?.manageAccount || "Manage your account preferences and settings"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                {translations.profile?.editProfile || "Edit Profile"}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                {translations.profile?.privacySettings || "Privacy Settings"}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                {translations.profile?.notificationSettings || "Notification Settings"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 