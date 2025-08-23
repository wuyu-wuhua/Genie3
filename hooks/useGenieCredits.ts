import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@supabase/supabase-js';
// 定义类型
interface GenieCreditUsage {
  remaining_credits: number;
  included_credits: number;
  used_credits: number;
  has_active_subscription: boolean;
  plan_name: string;
}

interface GenieCreditResult {
  success: boolean;
  message: string;
  remainingCredits?: number;
}

// 创建 Supabase 客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function useGenieCredits() {
  const { user } = useAuth();
  const [creditUsage, setCreditUsage] = useState<GenieCreditUsage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取积分使用情况
  const fetchCreditUsage = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      // 获取当前用户的 session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('用户未登录');
      }

      const response = await fetch('/api/credits/usage', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '获取积分信息失败');
      }

      const data = await response.json();
      setCreditUsage(data);
    } catch (err) {
      console.error('获取积分信息失败:', err);
      setError(err instanceof Error ? err.message : '获取积分信息失败');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // 消耗积分
  const consumeCredits = useCallback(async (
    creditsToConsume: number,
    actionType: string,
    actionMetadata: any = {}
  ): Promise<GenieCreditResult> => {
    if (!user) {
      return {
        success: false,
        message: '用户未登录'
      };
    }

    try {
      const response = await fetch('/api/credits/consume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creditsToConsume,
          actionType,
          actionMetadata
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '消耗积分失败');
      }

      if (data.success) {
        // 更新本地积分信息
        await fetchCreditUsage();
        return data;
      } else {
        throw new Error(data.message || '消耗积分失败');
      }
    } catch (error) {
      console.error('消耗积分失败:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : '消耗积分失败'
      };
    }
  }, [user, fetchCreditUsage]);

  // 添加积分
  const addCredits = useCallback(async (
    creditsToAdd: number,
    creditType: string = 'earn',
    description?: string,
    metadata: any = {}
  ): Promise<GenieCreditResult> => {
    if (!user) {
      return {
        success: false,
        message: '用户未登录'
      };
    }

    try {
      const response = await fetch('/api/credits/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creditsToAdd,
          creditType,
          description,
          metadata
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '添加积分失败');
      }

      if (data.success) {
        // 更新本地积分信息
        await fetchCreditUsage();
        return data;
      } else {
        throw new Error(data.message || '添加积分失败');
      }
    } catch (error) {
      console.error('添加积分失败:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : '添加积分失败'
      };
    }
  }, [user, fetchCreditUsage]);

  // 检查积分是否足够
  const checkCredits = useCallback((requiredCredits: number): boolean => {
    if (!creditUsage) return false;
    return creditUsage.remaining_credits >= requiredCredits;
  }, [creditUsage]);

  // 工具函数
  const formatCredits = useCallback((credits: number): string => {
    return credits.toLocaleString();
  }, []);

  const hasEnoughCredits = useCallback((current: number, required: number): boolean => {
    return current >= required;
  }, []);

  const calculateCreditUsagePercentage = useCallback((used: number, included: number): number => {
    if (included === 0) return 0;
    return Math.round((used / included) * 100);
  }, []);

  const getCreditStatusColor = useCallback((remaining: number, included: number): string => {
    if (remaining <= 0) return 'text-red-500';
    if (remaining <= included * 0.2) return 'text-orange-500';
    if (remaining <= included * 0.5) return 'text-yellow-500';
    return 'text-green-500';
  }, []);

  // 当用户登录状态改变时重新获取积分信息
  useEffect(() => {
    if (user) {
      fetchCreditUsage();
    } else {
      setCreditUsage(null);
      setIsLoading(false);
      setError(null);
    }
  }, [user]); // 移除 fetchCreditUsage 依赖，防止无限循环

  return {
    // 状态
    creditUsage,
    genieCreditUsage: creditUsage, // 添加别名以保持兼容性
    isLoading,
    error,
    
    // 方法
    fetchCreditUsage,
    consumeCredits,
    addCredits,
    checkCredits,
    
    // 工具函数
    formatCredits,
    hasEnoughCredits,
    calculateCreditUsagePercentage,
    getCreditStatusColor,
    
    // 便捷属性
    currentCredits: creditUsage?.remaining_credits || 0,
    includedCredits: creditUsage?.included_credits || 0,
    usedCredits: creditUsage?.used_credits || 0,
    hasActiveSubscription: creditUsage?.has_active_subscription || false,
    planName: creditUsage?.plan_name || '',
    
    // 计算属性
    creditUsagePercentage: creditUsage ? 
      calculateCreditUsagePercentage(
        creditUsage.used_credits, 
        creditUsage.included_credits
      ) : 0,
    
    creditStatusColor: creditUsage ? 
      getCreditStatusColor(
        creditUsage.remaining_credits, 
        creditUsage.included_credits
      ) : 'text-gray-500'
  };
}
