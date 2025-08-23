import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// =====================================================
// 类型定义
// =====================================================

export interface PaymentSession {
  sessionId: string;
  url: string;
}

export interface PaymentError {
  message: string;
  code?: string;
}

export interface PaymentHistory {
  id: string;
  amount: number;
  currency: string;
  payment_status: string;
  credits_earned: number;
  created_at: string;
  product_name?: string;
}

export interface CreditBalance {
  current_credits: number;
  total_earned_credits: number;
  subscription_credits: number;
}

// =====================================================
// 支付Hook
// =====================================================

export function usePayment() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<PaymentError | null>(null);

  // 创建支付会话
  const createPaymentSession = useCallback(async (
    productId: string,
    pricingId: string
  ): Promise<PaymentSession | null> => {
    if (!user) {
      setError({ message: '请先登录' });
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          pricingId,
          userId: user.id,
          userEmail: user.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '创建支付会话失败');
      }

      if (!data.success) {
        throw new Error(data.error || '创建支付会话失败');
      }

      return {
        sessionId: data.sessionId,
        url: data.url,
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '创建支付会话失败';
      setError({ message: errorMessage });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // 获取支付历史
  const getPaymentHistory = useCallback(async (): Promise<PaymentHistory[]> => {
    if (!user) {
      setError({ message: '请先登录' });
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/payment/manage?userId=${user.id}&action=history`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '获取支付历史失败');
      }

      return data.records || [];

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取支付历史失败';
      setError({ message: errorMessage });
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  // 获取积分余额
  const getCreditBalance = useCallback(async (): Promise<CreditBalance | null> => {
    if (!user) {
      setError({ message: '请先登录' });
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/payment/manage?userId=${user.id}&action=balance`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '获取积分余额失败');
      }

      return data.balance;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取积分余额失败';
      setError({ message: errorMessage });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // 获取所有支付信息
  const getAllPaymentInfo = useCallback(async (): Promise<{
    history: PaymentHistory[];
    balance: CreditBalance | null;
  }> => {
    if (!user) {
      setError({ message: '请先登录' });
      return { history: [], balance: null };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/payment/manage?userId=${user.id}&action=all`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '获取支付信息失败');
      }

      return {
        history: data.records || [],
        balance: data.balance,
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取支付信息失败';
      setError({ message: errorMessage });
      return { history: [], balance: null };
    } finally {
      setLoading(false);
    }
  }, [user]);

  // 重定向到支付页面
  const redirectToPayment = useCallback((url: string) => {
    if (url) {
      window.location.href = url;
    }
  }, []);

  // 清除错误
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // 状态
    loading,
    error,
    
    // 方法
    createPaymentSession,
    getPaymentHistory,
    getCreditBalance,
    getAllPaymentInfo,
    redirectToPayment,
    clearError,
  };
}

// =====================================================
// 支付状态Hook
// =====================================================

export function usePaymentStatus() {
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [sessionId, setSessionId] = useState<string | null>(null);

  const startPayment = useCallback((sessionId: string) => {
    setPaymentStatus('processing');
    setSessionId(sessionId);
  }, []);

  const completePayment = useCallback((success: boolean) => {
    setPaymentStatus(success ? 'success' : 'failed');
  }, []);

  const resetPayment = useCallback(() => {
    setPaymentStatus('idle');
    setSessionId(null);
  }, []);

  return {
    paymentStatus,
    sessionId,
    startPayment,
    completePayment,
    resetPayment,
  };
}
