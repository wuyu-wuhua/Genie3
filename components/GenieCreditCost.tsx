"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { GenieCreditCostBadge } from './GenieCreditCostBadge';
import { GenieCreditWarningModal } from './GenieCreditWarningModal';
import { GenieCreditConsumptionDialog } from './GenieCreditConsumptionDialog';
import { useGenieCredits } from '@/hooks/useGenieCredits';

interface GenieCreditCostProps {
  cost: number;
  actionDescription: string;
  onSuccess?: () => void;
  showConsumeButton?: boolean;
  className?: string;
}

export function GenieCreditCost({
  cost,
  actionDescription,
  onSuccess,
  showConsumeButton = true,
  className = ''
}: GenieCreditCostProps) {
  const { user } = useAuth();
  const { checkCredits: checkCreditsHook, currentCredits } = useGenieCredits();
  const [showWarning, setShowWarning] = useState(false);
  const [showConsumeDialog, setShowConsumeDialog] = useState(false);

  // 检查积分是否足够
  const checkCredits = async () => {
    if (!user) {
      setShowWarning(true);
      return;
    }

    if (checkCreditsHook(cost)) {
      setShowConsumeDialog(true);
    } else {
      setShowWarning(true);
    }
  };

  // 处理积分消耗成功
  const handleConsumeSuccess = (remainingCredits: number) => {
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* 积分成本徽章 */}
      <GenieCreditCostBadge cost={cost} size="md" />
      
      {/* 消耗积分按钮 */}
      {showConsumeButton && (
        <Button
          onClick={checkCredits}
          size="sm"
          variant="outline"
          className="text-xs"
        >
          消耗积分
        </Button>
      )}

      {/* 积分不足警告模态框 */}
      <GenieCreditWarningModal
        isOpen={showWarning}
        onClose={() => setShowWarning(false)}
        requiredCredits={cost}
        actionDescription={actionDescription}
        onUpgrade={() => {
          setShowWarning(false);
          window.location.href = '/pricing';
        }}
      />

      {/* 积分消耗对话框 */}
      <GenieCreditConsumptionDialog
        isOpen={showConsumeDialog}
        onClose={() => setShowConsumeDialog(false)}
        onSuccess={handleConsumeSuccess}
        defaultCredits={cost}
        defaultAction={actionDescription}
        title={`消耗 ${cost} 积分`}
        description={`确认消耗 ${cost} 积分来执行"${actionDescription}"操作吗？`}
      />
    </div>
  );
}

export default GenieCreditCost;
