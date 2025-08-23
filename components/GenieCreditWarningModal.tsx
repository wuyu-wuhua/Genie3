"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useGenieCredits } from '@/hooks/useGenieCredits';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface GenieCreditWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade?: () => void;
  requiredCredits: number;
  actionDescription: string;
  title?: string;
}

export function GenieCreditWarningModal({
  isOpen,
  onClose,
  onUpgrade,
  requiredCredits,
  actionDescription,
  title = '积分不足'
}: GenieCreditWarningModalProps) {
  const { user } = useAuth();
  const { creditUsage, isLoading, fetchCreditUsage, formatCredits } = useGenieCredits();

  // 当对话框打开时获取积分信息
  useEffect(() => {
    if (isOpen && user) {
      fetchCreditUsage();
    }
  }, [isOpen, user, fetchCreditUsage]);

  const currentCredits = creditUsage?.remaining_credits || 0;
  const hasActiveSubscription = creditUsage?.has_active_subscription || false;
  const planName = creditUsage?.plan_name || '';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-red-600">{title}</DialogTitle>
          <DialogDescription>
            您当前的积分不足以执行此操作
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* 积分信息 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {formatCredits(currentCredits)}
              </div>
              <div className="text-sm text-gray-600">当前可用积分</div>
            </div>
          </div>

          {/* 操作信息 */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">操作描述:</span>
              <span className="font-medium">{actionDescription}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">所需积分:</span>
              <span className="font-medium text-red-600">{formatCredits(requiredCredits)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">积分差额:</span>
              <span className="font-medium text-red-600">
                {formatCredits(Math.max(0, requiredCredits - currentCredits))}
              </span>
            </div>
          </div>

          {/* 订阅状态 */}
          {hasActiveSubscription && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-800">
                <div className="font-medium">当前订阅: {planName}</div>
                <div>您的订阅将在下一个计费周期自动续费</div>
              </div>
            </div>
          )}

          {/* 升级提示 */}
          {!hasActiveSubscription && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <div className="text-sm text-yellow-800">
                <div className="font-medium">升级订阅获得更多积分</div>
                <div>订阅用户每月可获得大量积分，支持更多操作</div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            取消
          </Button>
          
          {onUpgrade && (
            <Button
              onClick={onUpgrade}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
            >
              升级订阅
            </Button>
          )}
          
          <Button
            onClick={() => window.location.href = '/pricing'}
            className="w-full sm:w-auto"
          >
            查看定价
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default GenieCreditWarningModal;
