'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, CreditCard, Package } from 'lucide-react';
import { getUserCreditBalance } from '@/lib/payment-service';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [creditBalance, setCreditBalance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setError('缺少会话ID');
      setLoading(false);
      return;
    }

    // 这里可以获取支付详情和更新积分余额
    // 由于webhook是异步的，可能需要等待一段时间
    const timer = setTimeout(async () => {
      try {
        // 尝试获取用户积分余额
        // 注意：这里需要用户ID，实际使用时需要从认证上下文获取
        // const balance = await getUserCreditBalance(userId);
        // if (balance) {
        //   setCreditBalance(balance.current_credits);
        // }
        
        setLoading(false);
      } catch (err) {
        console.error('获取支付结果失败:', err);
        setError('获取支付结果失败');
        setLoading(false);
      }
    }, 2000); // 等待2秒让webhook处理完成

    return () => clearTimeout(timer);
  }, [sessionId]);

  const handleGoToProfile = () => {
    router.push('/profile');
  };

  const handleGoToGenerator = () => {
    router.push('/generator');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">正在处理您的支付...</p>
              <p className="text-sm text-gray-500 mt-2">请稍候，我们正在为您激活账户</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-red-600">支付处理中</CardTitle>
            <CardDescription>
              您的支付正在处理中，请稍后查看账户状态
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 text-center">
              如果问题持续存在，请联系客服支持
            </p>
            <div className="flex space-x-3">
              <Button onClick={handleGoToProfile} className="flex-1">
                查看账户
              </Button>
              <Button variant="outline" onClick={() => router.push('/pricing')} className="flex-1">
                返回定价
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-green-600">支付成功！</CardTitle>
          <CardDescription>
            感谢您的订阅，您的账户已成功激活
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 支付成功信息 */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">订阅已激活</p>
                <p className="text-sm text-green-600">
                  您现在可以使用所有高级功能
                </p>
              </div>
            </div>
          </div>

          {/* 积分信息 */}
          {creditBalance !== null && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">积分余额</p>
                  <p className="text-sm text-blue-600">
                    当前可用积分：{creditBalance.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 下一步操作 */}
          <div className="space-y-3">
            <Button onClick={handleGoToGenerator} className="w-full">
              开始生成世界
            </Button>
            <Button variant="outline" onClick={handleGoToProfile} className="w-full">
              查看账户详情
            </Button>
          </div>

          {/* 提示信息 */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              如有任何问题，请联系我们的客服团队
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


