"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  User, 
  CreditCard, 
  Zap, 
  Calendar, 
  Settings, 
  Gift,
  History,
  Plus,
  AlertCircle,
  RefreshCw
} from "lucide-react";

interface UserDashboardProps {
  className?: string;
}

export function UserDashboard({ className }: UserDashboardProps) {
  const { user, userProfile, session, refreshUserProfile, manualSyncUserData } = useAuth();
  const [showCreditHistory, setShowCreditHistory] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 格式化积分显示
  const formatCredits = (credits: number) => {
    return credits.toLocaleString();
  };

  // 获取用户积分使用情况
  const fetchUserCreditUsage = useCallback(async (userId: string) => {
    try {
      // 简化：直接从userProfile获取积分信息
      if (userProfile) {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  }, [userProfile]);

  // 获取真实积分余额
  const fetchRealBalance = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      await refreshUserProfile();
    } catch (error) {
      // 静默处理错误
    }
  }, [user?.id, refreshUserProfile]);

  // 同步Google用户信息
  const syncGoogleUserInfo = useCallback(async () => {
    if (!user) return;
    try {
      const response = await fetch('/api/debug/sync-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (response.ok) {
        const result = await response.json();
        // 刷新用户档案
        await refreshUserProfile();
      }
    } catch (error) {
      // 静默处理错误
    }
  }, [user, refreshUserProfile]);

  // 页面可见性检测
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      setIsPageVisible(isVisible);
      
      if (isVisible && user?.id) {
        fetchUserCreditUsage(user.id);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user?.id, fetchUserCreditUsage]);

  // 页面焦点检测
  useEffect(() => {
    const handleFocus = () => {
      if (user?.id) {
        fetchUserCreditUsage(user.id);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user?.id, fetchUserCreditUsage]);

  // 初始化数据
  useEffect(() => {
    if (user?.id) {
      fetchUserCreditUsage(user.id);
      fetchRealBalance();
    }
  }, [user?.id, fetchUserCreditUsage, fetchRealBalance]);

  // 手动同步用户数据
  const handleManualSync = async () => {
    if (!user) return;
    
    try {
      const result = await manualSyncUserData();
      if (result?.success) {
        // 刷新用户档案
        await refreshUserProfile();
      }
    } catch (error) {
      // 静默处理错误
    }
  };

  if (!user) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">请先登录</h3>
          <p className="text-muted-foreground">登录后查看您的仪表板</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <RefreshCw className="mx-auto h-12 w-12 text-muted-foreground mb-4 animate-spin" />
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  const currentCredits = userProfile?.current_credits || 0;
  const totalEarnedCredits = userProfile?.total_earned_credits || 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 用户信息卡片 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">用户信息</CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{user.email}</div>
          <p className="text-xs text-muted-foreground">
            用户ID: {user.id}
          </p>
        </CardContent>
      </Card>

      {/* 积分余额卡片 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">积分余额</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCredits(currentCredits)}</div>
          <p className="text-xs text-muted-foreground">
            总获得积分: {formatCredits(totalEarnedCredits)}
          </p>
        </CardContent>
      </Card>

      {/* 操作按钮 */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleManualSync} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          同步数据
        </Button>
        
        <Button onClick={syncGoogleUserInfo} variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          同步用户信息
        </Button>
      </div>

      {/* 错误显示 */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

