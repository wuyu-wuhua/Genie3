'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Settings, History, Star, Download } from 'lucide-react';
import Image from 'next/image';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEnglish, setIsEnglish] = useState(true);

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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white dark:text-white mb-4">
            {isEnglish ? "Please log in to view your profile" : "请登录查看您的个人空间"}
          </h1>
          <Button asChild className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600">
            <a href="/generator">{isEnglish ? "Go to Login" : "前往登录"}</a>
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
            {user.user_metadata?.full_name || user.email || (isEnglish ? "User" : "用户")}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{user.email}</p>
          <div className="flex justify-center space-x-4">
            <Badge className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
              {isEnglish ? "Active User" : "活跃用户"}
            </Badge>
            <Badge className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">
              {isEnglish ? "Premium" : "高级用户"}
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <History className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{isEnglish ? "Worlds Created" : "已创建世界"}</p>
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
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">1,250</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{isEnglish ? "Credits Left" : "剩余积分"}</p>
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
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">18</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{isEnglish ? "Downloads" : "下载次数"}</p>
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
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">7</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{isEnglish ? "Days Active" : "活跃天数"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                <History className="h-5 w-5" />
                <span>{isEnglish ? "Recent Activity" : "最近活动"}</span>
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                {isEnglish ? "Your latest world generations" : "您最近的世界生成记录"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{item}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {isEnglish ? `World ${item}` : `世界 ${item}`}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {isEnglish ? "2 hours ago" : "2小时前"}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      {isEnglish ? "View" : "查看"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                <Settings className="h-5 w-5" />
                <span>{isEnglish ? "Account Settings" : "账户设置"}</span>
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                {isEnglish ? "Manage your account preferences" : "管理您的账户偏好设置"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  {isEnglish ? "Edit Profile" : "编辑资料"}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  {isEnglish ? "Preferences" : "偏好设置"}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Star className="h-4 w-4 mr-2" />
                  {isEnglish ? "Subscription" : "订阅管理"}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  {isEnglish ? "Download History" : "下载历史"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 