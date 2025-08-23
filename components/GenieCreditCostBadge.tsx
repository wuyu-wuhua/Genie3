"use client";

import { Badge } from '@/components/ui/badge';
import { useGenieCredits } from '@/hooks/useGenieCredits';

interface GenieCreditCostBadgeProps {
  cost: number;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export function GenieCreditCostBadge({
  cost,
  variant = 'default',
  size = 'md',
  showIcon = true,
  className = ''
}: GenieCreditCostBadgeProps) {
  const { formatCredits } = useGenieCredits();
  
  // 根据成本大小选择颜色
  const getVariant = () => {
    if (cost <= 10) return 'default';
    if (cost <= 50) return 'secondary';
    if (cost <= 100) return 'outline';
    return 'destructive';
  };

  // 根据大小选择样式
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-1';
      case 'lg':
        return 'text-base px-3 py-1.5';
      default:
        return 'text-sm px-2.5 py-1';
    }
  };

  // 获取图标
  const getIcon = () => {
    if (!showIcon) return null;
    
    if (cost <= 10) return '💎';
    if (cost <= 50) return '⭐';
    if (cost <= 100) return '🔥';
    return '⚡';
  };

  return (
    <Badge
      variant={getVariant()}
      className={`${getSizeClasses()} ${className}`}
    >
      {getIcon()} {formatCredits(cost)} 积分
    </Badge>
  );
}

export default GenieCreditCostBadge;
