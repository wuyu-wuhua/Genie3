"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface GenieCreditConsumptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (remainingCredits: number) => void;
  defaultCredits?: number;
  defaultAction?: string;
  title?: string;
  description?: string;
}

export function GenieCreditConsumptionDialog({
  isOpen,
  onClose,
  onSuccess,
  defaultCredits = 1,
  defaultAction = '',
  title = '消耗积分',
  description = '请输入要消耗的积分数量和操作类型'
}: GenieCreditConsumptionDialogProps) {
  const { user } = useAuth();
  const [creditsToConsume, setCreditsToConsume] = useState(defaultCredits);
  const [actionType, setActionType] = useState(defaultAction);
  const [actionMetadata, setActionMetadata] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 处理积分消耗
  const handleConsumeCredits = async () => {
    if (!user) {
      toast({
        title: "错误",
        description: "请先登录",
        variant: "destructive",
      });
      return;
    }

    if (!creditsToConsume || creditsToConsume <= 0) {
      toast({
        title: "错误",
        description: "请输入有效的积分数量",
        variant: "destructive",
      });
      return;
    }

    if (!actionType.trim()) {
      toast({
        title: "错误",
        description: "请输入操作类型",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch('/api/credits/consume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creditsToConsume,
          actionType: actionType.trim(),
          actionMetadata: actionMetadata.trim() ? { description: actionMetadata.trim() } : {}
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '消耗积分失败');
      }

      if (data.success) {
        toast({
          title: "成功",
          description: data.message,
        });

        // 调用成功回调
        if (onSuccess) {
          onSuccess(data.remainingCredits);
        }

        // 关闭对话框
        onClose();

        // 重置表单
        setCreditsToConsume(defaultCredits);
        setActionType(defaultAction);
        setActionMetadata('');
      } else {
        throw new Error(data.message || '消耗积分失败');
      }
    } catch (error) {
      console.error('消耗积分失败:', error);
      toast({
        title: "错误",
        description: error instanceof Error ? error.message : '消耗积分失败',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 处理对话框关闭
  const handleClose = () => {
    if (!isLoading) {
      onClose();
      // 重置表单
      setCreditsToConsume(defaultCredits);
      setActionType(defaultAction);
      setActionMetadata('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="credits" className="text-right">
              积分数量
            </Label>
            <Input
              id="credits"
              type="number"
              min="1"
              value={creditsToConsume}
              onChange={(e) => setCreditsToConsume(parseInt(e.target.value) || 0)}
              className="col-span-3"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="action" className="text-right">
              操作类型
            </Label>
            <Input
              id="action"
              type="text"
              placeholder="例如：生成世界、导出模型等"
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
              className="col-span-3"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="metadata" className="text-right">
              备注
            </Label>
            <Textarea
              id="metadata"
              placeholder="可选：添加操作相关的备注信息"
              value={actionMetadata}
              onChange={(e) => setActionMetadata(e.target.value)}
              className="col-span-3"
              rows={3}
              disabled={isLoading}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            取消
          </Button>
          <Button
            type="submit"
            onClick={handleConsumeCredits}
            disabled={isLoading || !creditsToConsume || !actionType.trim()}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                处理中...
              </>
            ) : (
              '确认消耗'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default GenieCreditConsumptionDialog;
