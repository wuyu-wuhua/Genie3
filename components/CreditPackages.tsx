'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Zap, Star, Crown } from 'lucide-react';

interface CreditPackage {
  id: string;
  package_name: string;
  credits_amount: number;
  price: number;
  currency: string;
  description: string;
  is_active: boolean;
}

export function CreditPackages() {
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/credits/packages');
      const data = await response.json();

      if (data.success) {
        setPackages(data.packages);
      } else {
        setError(data.error || '获取积分包失败');
      }
    } catch (error) {
      console.error('获取积分包失败:', error);
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (packageId: string, packageName: string, credits: number, price: number) => {
    try {
      console.log('购买积分包:', { packageId, packageName, credits, price });
      
      // TODO: 实现Stripe支付逻辑
      alert(`即将购买 ${packageName}，积分: ${credits}，价格: $${price}`);
      
      // 这里应该跳转到Stripe支付页面
      // const response = await fetch('/api/payment/create-checkout-session', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ packageId, credits, price })
      // });
      
    } catch (error) {
      console.error('购买失败:', error);
      alert('购买失败，请稍后重试');
    }
  };

  const getPackageIcon = (credits: number) => {
    if (credits >= 2000) return <Crown className="h-6 w-6 text-yellow-500" />;
    if (credits >= 1000) return <Star className="h-6 w-6 text-purple-500" />;
    if (credits >= 500) return <Zap className="h-6 w-6 text-blue-500" />;
    return <Zap className="h-6 w-6 text-green-500" />;
  };

  const getPackageColor = (credits: number) => {
    if (credits >= 2000) return 'border-yellow-200 bg-yellow-50';
    if (credits >= 1000) return 'border-purple-200 bg-purple-50';
    if (credits >= 500) return 'border-blue-200 bg-blue-50';
    return 'border-green-200 bg-green-50';
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mx-auto mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <Button onClick={fetchPackages} variant="outline">
            重试
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">积分包购买</h1>
        <p className="text-muted-foreground">选择适合您的积分包，提升AI生成体验</p>
      </div>

      {/* 积分包网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg) => (
          <Card key={pkg.id} className={`${getPackageColor(pkg.credits_amount)} hover:shadow-lg transition-shadow`}>
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-3">
                {getPackageIcon(pkg.credits_amount)}
              </div>
              <CardTitle className="text-lg font-semibold">{pkg.package_name}</CardTitle>
              <div className="text-3xl font-bold text-primary">
                {pkg.credits_amount}
              </div>
              <div className="text-sm text-muted-foreground">积分</div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  ${pkg.price}
                </div>
                <div className="text-sm text-muted-foreground">
                  {pkg.currency}
                </div>
              </div>
              
              {pkg.description && (
                <p className="text-sm text-muted-foreground text-center">
                  {pkg.description}
                </p>
              )}
              
              <Button 
                className="w-full" 
                onClick={() => handlePurchase(pkg.id, pkg.package_name, pkg.credits_amount, pkg.price)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                立即购买
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 购买说明 */}
      <div className="mt-12 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">购买说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>积分包购买后立即到账，无使用期限</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>支持多种支付方式，支付安全有保障</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>购买后可在个人空间查看积分余额</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>如有问题请联系客服支持</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
