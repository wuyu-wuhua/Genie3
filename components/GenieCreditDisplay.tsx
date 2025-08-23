"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGenieCredits } from '@/hooks/useGenieCredits';

interface GenieCreditDisplayProps {
  className?: string;
  showDetails?: boolean;
}

export function GenieCreditDisplay({ className = '', showDetails = false }: GenieCreditDisplayProps) {
  const { user } = useAuth();
  const { creditUsage, isLoading, error, fetchCreditUsage, formatCredits, getCreditStatusColor } = useGenieCredits();

  // 当用户登录状态改变时重新获取积分信息
  useEffect(() => {
    if (user) {
      fetchCreditUsage();
    }
  }, [user, fetchCreditUsage]);

  // 如果没有用户，显示登录提示
  if (!user) {
    return (
      <div className={`text-center p-4 ${className}`}>
        <p className="text-gray-500">请登录查看积分信息</p>
      </div>
    );
  }

  // 加载状态
  if (isLoading) {
    return (
      <div className={`text-center p-4 ${className}`}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
        <p className="text-gray-500 mt-2">加载积分信息中...</p>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className={`text-center p-4 ${className}`}>
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchCreditUsage}
          className="mt-2 text-blue-500 hover:text-blue-700 underline"
        >
          重试
        </button>
      </div>
    );
  }

  // 没有积分信息
  if (!creditUsage) {
    return (
      <div className={`text-center p-4 ${className}`}>
        <p className="text-gray-500">暂无积分信息</p>
      </div>
    );
  }

  const { remaining_credits: remainingCredits, included_credits: includedCredits, has_active_subscription: hasActiveSubscription, plan_name: planName } = creditUsage;

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      {/* 积分余额显示 */}
      <div className="text-center mb-4">
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {formatCredits(remainingCredits)}
        </div>
        <div className="text-sm text-gray-600">可用积分</div>
      </div>

      {/* 订阅状态 */}
      {hasActiveSubscription && (
        <div className="text-center mb-4">
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5"></span>
            活跃订阅
          </div>
          {planName && (
            <div className="text-sm text-gray-600 mt-1">{planName}</div>
          )}
        </div>
      )}

      {/* 详细积分信息 */}
      {showDetails && (
        <div className="border-t border-gray-200 pt-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">套餐包含积分:</span>
              <span className="font-medium">{formatCredits(includedCredits)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">已使用积分:</span>
              <span className="font-medium">{formatCredits(includedCredits - remainingCredits)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">剩余积分:</span>
              <span className={`font-medium ${getCreditStatusColor(remainingCredits, includedCredits)}`}>
                {formatCredits(remainingCredits)}
              </span>
            </div>
          </div>

          {/* 积分使用进度条 */}
          {includedCredits > 0 && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>积分使用进度</span>
                <span>{Math.round(((includedCredits - remainingCredits) / includedCredits) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(((includedCredits - remainingCredits) / includedCredits) * 100, 100)}%`
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 刷新按钮 */}
      <div className="text-center mt-4">
        <button
          onClick={fetchCreditUsage}
          className="text-blue-500 hover:text-blue-700 text-sm underline"
        >
          刷新积分信息
        </button>
      </div>
    </div>
  );
}

export default GenieCreditDisplay;
