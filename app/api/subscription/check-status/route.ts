import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 初始化 Supabase 客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: '缺少必要参数：userId' },
        { status: 400 }
      );
    }

    console.log(`开始检查用户 ${userId} 的订阅状态...`);

    // 获取用户的最新订阅
    const { data: subscription, error: subError } = await supabase
      .from('genie_user_subscriptions')
      .select(`
        *,
        genie_products!inner (
          name,
          credit_amount,
          bonus_credits
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (subError && subError.code !== 'PGRST116') {
      console.error('获取订阅信息失败:', subError);
      return NextResponse.json(
        { error: '获取订阅信息失败' },
        { status: 500 }
      );
    }

    // 如果没有订阅，直接返回
    if (!subscription) {
      return NextResponse.json({
        hasSubscription: false,
        message: '用户没有订阅记录'
      });
    }

    // 获取用户积分余额
    const { data: balanceData, error: balanceError } = await supabase
      .from('genie_credit_balances')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (balanceError && balanceError.code !== 'PGRST116') {
      console.error('获取积分余额失败:', balanceError);
    }

    // 检查订阅状态
    const now = new Date();
    const periodEnd = subscription.current_period_end ? new Date(subscription.current_period_end) : null;
    
    const isActive = subscription.status === 'Active';
    const isCanceled = subscription.status === 'canceled';
    const isEnded = subscription.status === 'ended';
    const isExpired = periodEnd && periodEnd <= now;
    
    // 检查订阅是否真的结束了
    const isSubscriptionReallyEnded = (
      subscription.status === 'ended' ||
      subscription.status === 'canceled' ||
      subscription.status === 'unpaid' ||
      subscription.status === 'incomplete_expired' ||
      (subscription.cancel_at_period_end && 
       subscription.current_period_end && 
       new Date(subscription.current_period_end) < now)
    );

    // 如果订阅已结束且有积分，自动清零
    if (isSubscriptionReallyEnded && balanceData?.current_credits > 0) {
      console.log(`订阅已结束，开始自动清零积分...`);
      
      try {
        // 直接清零积分，不使用外部模块
        const { error: clearError } = await supabase
          .from('genie_credit_balances')
          .update({
            current_credits: 0,
            subscription_credits: 0,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
        
        if (clearError) {
          console.error(`积分自动清零失败:`, clearError);
        } else {
          console.log(`积分自动清零成功`);
        }
      } catch (clearError) {
        console.error('自动清零积分失败:', clearError);
      }
    }
    
    console.log(`订阅状态分析:`, {
      subscriptionId: subscription.id,
      status: subscription.status,
      periodEnd: periodEnd,
      isExpired,
      isSubscriptionReallyEnded,
      subscriptionCreatedAt: subscription.created_at,
      isRecentlyCreated: new Date(subscription.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    });

    // 如果订阅真的结束了，需要清零积分
    if (isSubscriptionReallyEnded) {
      console.log(`检测到用户 ${userId} 的订阅已结束，开始清零积分...`);
      
      try {
        // 直接清零积分，不使用外部模块
        const { error: clearError } = await supabase
          .from('genie_credit_balances')
          .update({
            current_credits: 0,
            subscription_credits: 0,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
        
        if (clearError) {
          console.error(`清零用户 ${userId} 积分失败:`, clearError);
          return NextResponse.json(
            { 
              error: '积分清零失败',
              details: clearError.message 
            },
            { status: 500 }
          );
        }
        
        console.log(`积分清零成功`);
        
        return NextResponse.json({
          hasSubscription: true,
          subscriptionStatus: 'ended',
          message: '订阅已结束，积分已清零',
          creditsCleared: 0,
          subscription: {
            id: subscription.id,
            status: 'ended',
            planName: subscription.genie_products?.name,
            periodEnd: subscription.current_period_end,
            isExpired: true
          }
        });
        
      } catch (clearError: any) {
        console.error(`清零用户 ${userId} 积分失败:`, clearError);
        return NextResponse.json(
          { 
            error: '积分清零失败',
            details: clearError.message 
          },
          { status: 500 }
        );
      }
    }

    // 如果订阅仍然有效
    return NextResponse.json({
      hasSubscription: true,
      subscriptionStatus: subscription.status,
      message: '订阅状态正常',
      subscription: {
        id: subscription.id,
        status: subscription.status,
        planName: subscription.genie_products?.name,
        periodEnd: subscription.current_period_end,
        isExpired: isExpired,
        isActive: isActive && !isExpired,
        isCanceled: isCanceled && !isExpired
      }
    });

  } catch (error: any) {
    console.error('检查订阅状态失败:', error);
    return NextResponse.json(
      { 
        error: '检查订阅状态失败',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
