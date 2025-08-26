import { NextRequest, NextResponse } from 'next/server';
import { createPaymentSession, getProduct, getUserPaymentRecords } from '@/lib/payment-service';
import { createClient } from '@supabase/supabase-js';

// 强制动态渲染，避免静态生成问题
export const dynamic = 'force-dynamic';

// 初始化Supabase客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// =====================================================
// GET - 获取订阅计划或用户支付记录
// =====================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const action = searchParams.get('action');
    const interval = searchParams.get('interval') as 'monthly' | 'yearly' | null;

    // 如果请求用户支付记录
    if (action === 'history' && userId) {
      const records = await getUserPaymentRecords(userId, 100, 0);
      return NextResponse.json({ success: true, records });
    }

    // 获取订阅计划
    let products;
    
    if (interval) {
      // 根据计费周期获取产品
      const { data, error } = await supabase
        .from('genie_products')
        .select('*')
        .eq('billing_cycle', interval)
        .order('price', { ascending: true });

      if (error) throw error;
      products = data;
    } else {
      // 获取所有产品
      const { data, error } = await supabase
        .from('genie_products')
        .select('*')
        .order('price', { ascending: true });

      if (error) throw error;
      products = data;
    }

    if (!products || products.length === 0) {
      return NextResponse.json(
        { error: '没有找到可用的订阅计划' },
        { status: 404 }
      );
    }

    // 转换数据格式以匹配前端期望的结构
    const subscriptionPlans = products.map(product => {
      return {
        id: product.id,
        name: product.name,
        description: product.description || '',
        type: product.plan_type,
        status: 'Active',
        isPopular: product.plan_type === 'premium',
        creditAmount: product.credits,
        bonusCredits: 0,
        sortOrder: product.plan_type === 'premium' ? 2 : 1,
        metadata: {},
        features: [],
        pricing: {
          id: product.id,
          name: product.billing_cycle === 'monthly' ? '月付' : '年付',
          amount: product.price.toString(),
          currency: product.currency.toUpperCase(),
          type: 'recurring',
          status: 'Active',
          recurringInterval: product.billing_cycle === 'monthly' ? 'month' : 'year',
          recurringIntervalCount: 1,
          trialPeriodDays: product.billing_cycle === 'monthly' ? 7 : 30,
          stripePriceId: product.price_id
        }
      };
    });

    return NextResponse.json(subscriptionPlans);

  } catch (error) {
    console.error('获取数据失败:', error);
    return NextResponse.json(
      { error: '获取数据失败' },
      { status: 500 }
    );
  }
}

// =====================================================
// POST - 创建结账会话
// =====================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, pricingId, userId, userEmail } = body;
    
    console.log('收到订阅请求:', { productId, pricingId, userId, userEmail });

    if (!productId || !pricingId || !userId || !userEmail) {
      return NextResponse.json(
        { error: '缺少必要的参数' },
        { status: 400 }
      );
    }

    // 验证产品是否存在
    const product = await getProduct(pricingId);
    if (!product) {
      return NextResponse.json(
        { error: '产品不存在' },
        { status: 404 }
      );
    }

    // 创建支付会话
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const successUrl = `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/pricing?canceled=true`;

    const result = await createPaymentSession({
      priceId: pricingId,
      userEmail,
      userId,
      productId,
      successUrl,
      cancelUrl
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || '创建支付会话失败' },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      sessionId: result.sessionId,
      url: result.url 
    });

  } catch (error) {
    console.error('创建结账会话失败:', error);
    return NextResponse.json(
      { error: '创建结账会话失败' },
      { status: 500 }
    );
  }
}
