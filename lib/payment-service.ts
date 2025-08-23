import { createClient } from '@supabase/supabase-js';
import { stripe, createCheckoutSession, createOrUpdateStripeCustomer } from './stripe';

// 初始化Supabase客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// =====================================================
// 类型定义
// =====================================================

export interface PaymentProduct {
  id: string;
  name: string;
  plan_type: string;
  credits: number;
  price: number;
  currency: string;
  price_id: string;
  description?: string;
  billing_cycle: string;
}

export interface PaymentRecord {
  id: string;
  user_id: string;
  product_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  payment_status: 'pending' | 'succeeded' | 'failed' | 'canceled';
  transaction_id: string;
  credits_earned: number;
  metadata: any;
}

export interface CreditBalance {
  id: string;
  user_id: string;
  current_credits: number;
  total_earned_credits: number;
  subscription_credits: number;
  last_transaction_id?: string;
}

// =====================================================
// 支付相关函数
// =====================================================

/**
 * 创建支付会话
 */
export async function createPaymentSession({
  priceId,
  userEmail,
  userId,
  productId,
  successUrl,
  cancelUrl
}: {
  priceId: string;
  userEmail: string;
  userId: string;
  productId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  try {
    // 1. 创建或更新Stripe客户
    const customerResult = await createOrUpdateStripeCustomer({
      email: userEmail,
      userId,
    });

    if (!customerResult.success || !customerResult.customer) {
      throw new Error(customerResult.error || '创建Stripe客户失败');
    }

    // 2. 创建Checkout会话
    const sessionResult = await createCheckoutSession({
      priceId,
      customerEmail: userEmail,
      userId,
      productId,
      successUrl,
      cancelUrl,
      mode: 'subscription'
    });

    if (!sessionResult.success) {
      throw new Error(sessionResult.error);
    }

    // 3. 在数据库中创建支付记录
    await createPaymentRecord({
      userId,
      productId,
      amount: 0, // 金额将在webhook中更新
      currency: 'USD',
      paymentMethod: 'stripe',
      paymentStatus: 'pending',
      transactionId: sessionResult.sessionId!,
      creditsEarned: 0, // 积分数量将在webhook中更新
      metadata: {
        sessionId: sessionResult.sessionId,
        customerId: customerResult.customer.id,
        priceId
      }
    });

    return {
      success: true,
      sessionId: sessionResult.sessionId,
      url: sessionResult.url,
      customerId: customerResult.customer.id
    };

  } catch (error) {
    console.error('创建支付会话失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    };
  }
}

/**
 * 创建支付记录
 */
export async function createPaymentRecord({
  userId,
  productId,
  amount,
  currency,
  paymentMethod,
  paymentStatus,
  transactionId,
  creditsEarned,
  metadata
}: {
  userId: string;
  productId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string;
  creditsEarned: number;
  metadata: any;
}) {
  try {
    const { data, error } = await supabase
      .from('genie_payment_records')
      .insert({
        user_id: userId,
        product_id: productId,
        amount,
        currency,
        payment_method: paymentMethod,
        payment_status: paymentStatus,
        transaction_id: transactionId,
        credits_earned: creditsEarned,
        metadata
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, record: data };
  } catch (error) {
    console.error('创建支付记录失败:', error);
    return { success: false, error: error instanceof Error ? error.message : '未知错误' };
  }
}

/**
 * 更新支付记录状态
 */
export async function updatePaymentRecordStatus({
  transactionId,
  paymentStatus,
  amount,
  creditsEarned,
  metadata
}: {
  transactionId: string;
  paymentStatus: string;
  amount?: number;
  creditsEarned?: number;
  metadata?: any;
}) {
  try {
    const updateData: any = {
      payment_status: paymentStatus,
      updated_at: new Date().toISOString()
    };

    if (amount !== undefined) updateData.amount = amount;
    if (creditsEarned !== undefined) updateData.credits_earned = creditsEarned;
    if (metadata) updateData.metadata = { ...updateData.metadata, ...metadata };

    const { data, error } = await supabase
      .from('genie_payment_records')
      .update(updateData)
      .eq('transaction_id', transactionId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, record: data };
  } catch (error) {
    console.error('更新支付记录状态失败:', error);
    return { success: false, error: error instanceof Error ? error.message : '未知错误' };
  }
}

/**
 * 为新用户添加50积分（新用户登录时调用）
 */
export async function addNewUserCredits(userId: string) {
  try {
    // 检查用户是否已有积分余额记录
    const { data: existingBalance } = await supabase
      .from('genie_credit_balances')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (existingBalance) {
      // 用户已有积分记录，返回现有记录
      return { success: true, balance: existingBalance, isNew: false };
    }

    // 为新用户创建积分余额记录，直接给50积分
    const { data, error } = await supabase
      .from('genie_credit_balances')
      .insert({
        user_id: userId,
        current_credits: 50,
        total_earned_credits: 50,
        subscription_credits: 0
      })
      .select()
      .single();

    if (error) throw error;
    
    console.log(`为新用户 ${userId} 添加50积分成功`);
    return { success: true, balance: data, isNew: true };
  } catch (error) {
    console.error('为新用户添加积分失败:', error);
    return { success: false, error: error instanceof Error ? error.message : '未知错误' };
  }
}

/**
 * 为用户添加积分
 */
export async function addUserCredits({
  userId,
  creditsToAdd,
  transactionId,
  metadata
}: {
  userId: string;
  creditsToAdd: number;
  transactionId: string;
  metadata?: any;
}) {
  try {
    // 1. 检查用户是否已有积分余额记录
    const { data: existingBalance } = await supabase
      .from('genie_credit_balances')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (existingBalance) {
      // 更新现有记录
      const { data, error } = await supabase
        .from('genie_credit_balances')
        .update({
          current_credits: existingBalance.current_credits + creditsToAdd,
          total_earned_credits: existingBalance.total_earned_credits + creditsToAdd,
          last_transaction_id: transactionId,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, balance: data };
    } else {
      // 创建新记录
      const { data, error } = await supabase
        .from('genie_credit_balances')
        .insert({
          user_id: userId,
          current_credits: creditsToAdd,
          total_earned_credits: creditsToAdd,
          last_transaction_id: transactionId
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, balance: data };
    }
  } catch (error) {
    console.error('为用户添加积分失败:', error);
    return { success: false, error: error instanceof Error ? error.message : '未知错误' };
  }
}

/**
 * 获取产品信息
 */
export async function getProduct(productId: string): Promise<PaymentProduct | null> {
  try {
    // 直接通过价格ID查询产品
    const { data, error } = await supabase
      .from('genie_products')
      .select('*')
      .eq('price_id', productId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data;
  } catch (error) {
    console.error('获取产品信息失败:', error);
    return null;
  }
}

/**
 * 根据价格ID获取产品信息
 */
export async function getProductByPriceId(priceId: string): Promise<PaymentProduct | null> {
  try {
    const { data, error } = await supabase
      .from('genie_products')
      .select('*')
      .eq('price_id', priceId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data;
  } catch (error) {
    console.error('根据价格ID获取产品信息失败:', error);
    return null;
  }
}

/**
 * 获取用户支付记录
 */
export async function getUserPaymentRecords(
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<PaymentRecord[]> {
  try {
    const { data, error } = await supabase
      .from('genie_payment_records')
      .select(`
        *,
        genie_products (
          name,
          plan_type,
          credits,
          description
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('获取用户支付记录失败:', error);
    return [];
  }
}

/**
 * 获取用户积分余额
 */
export async function getUserCreditBalance(userId: string): Promise<CreditBalance | null> {
  try {
    const { data, error } = await supabase
      .from('genie_credit_balances')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data;
  } catch (error) {
    console.error('获取用户积分余额失败:', error);
    return null;
  }
}

/**
 * 处理支付成功
 */
export async function handlePaymentSuccess({
  sessionId,
  amount,
  customerId
}: {
  sessionId: string;
  amount: number;
  customerId: string;
}) {
  try {
    // 1. 获取支付记录
    const { data: paymentRecord } = await supabase
      .from('genie_payment_records')
      .select('*')
      .eq('transaction_id', sessionId)
      .single();

    if (!paymentRecord) {
      throw new Error('支付记录不存在');
    }

    // 2. 获取产品信息
    const product = await getProduct(paymentRecord.product_id);
    if (!product) {
      throw new Error('产品信息不存在');
    }

    // 3. 更新支付记录状态
    await updatePaymentRecordStatus({
      transactionId: sessionId,
      paymentStatus: 'succeeded',
      amount: amount / 100, // Stripe金额以分为单位
      creditsEarned: product.credits,
      metadata: {
        customerId,
        processedAt: new Date().toISOString()
      }
    });

    // 注释掉积分处理逻辑，避免重复添加积分
    // 订阅的积分由订阅Webhook处理，这里只处理支付记录状态更新
    /*
    // 4. 检查是否为订阅支付，如果是则跳过积分添加（订阅Webhook已处理）
    const { data: existingCredits } = await supabase
      .from('genie_credit_balances')
      .select('subscription_credits')
      .eq('user_id', paymentRecord.user_id)
      .single();
    
    // 如果用户已有订阅积分，说明是订阅支付，跳过积分添加
    if (existingCredits && existingCredits.subscription_credits > 0) {
      console.log('用户已有订阅积分，跳过积分添加:', existingCredits.subscription_credits);
    } else {
      // 为用户添加积分（非订阅支付）
      await addUserCredits({
        userId: paymentRecord.user_id,
        creditsToAdd: product.credits,
        transactionId: paymentRecord.id,
        metadata: {
          productId: product.id,
          productName: product.name,
          paymentAmount: amount / 100
        }
      });
    }
    */
    
    console.log('支付处理完成，积分由订阅Webhook处理');

    return { success: true, message: '支付处理成功' };
  } catch (error) {
    console.error('处理支付成功失败:', error);
    return { success: false, error: error instanceof Error ? error.message : '未知错误' };
  }
}

/**
 * 处理支付失败
 */
export async function handlePaymentFailure({
  sessionId,
  errorMessage
}: {
  sessionId: string;
  errorMessage: string;
}) {
  try {
    await updatePaymentRecordStatus({
      transactionId: sessionId,
      paymentStatus: 'failed',
      metadata: {
        errorMessage,
        failedAt: new Date().toISOString()
      }
    });

    return { success: true, message: '支付失败状态已更新' };
  } catch (error) {
    console.error('处理支付失败失败:', error);
    return { success: false, error: error instanceof Error ? error.message : '未知错误' };
  }
}
