import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { handlePaymentSuccess, handlePaymentFailure, getProduct, getProductByPriceId, addUserCredits } from '@/lib/payment-service';
import { createClient } from '@supabase/supabase-js';

// =====================================================
// Stripe Webhook 处理
// =====================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
  
      return NextResponse.json(
        { error: '缺少Stripe签名' },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
  
      return NextResponse.json(
        { error: 'Webhook配置错误' },
        { status: 500 }
      );
    }

    let event;
    try {
      // 验证Webhook签名
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {

      return NextResponse.json(
        { error: 'Webhook签名验证失败' },
        { status: 400 }
      );
    }

    console.log('收到Stripe Webhook事件:', event.type);

    // 处理Webhook事件
    const result = await handleStripeWebhook(event);

    if (result.success) {
      console.log('Webhook处理成功:', result.message);
      return NextResponse.json({ received: true, message: result.message });
    } else {
      console.error('Webhook处理失败:', result.message);
      return NextResponse.json(
        { error: result.message },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Webhook处理异常:', error);
    return NextResponse.json(
      { error: 'Webhook处理失败' },
      { status: 500 }
    );
  }
}

/**
 * 处理Stripe Webhook事件
 */
async function handleStripeWebhook(event: any) {
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        return await handleCheckoutSessionCompleted(event.data.object);
      
      case 'invoice.payment_succeeded':
        return await handleInvoicePaymentSucceeded(event.data.object);
      
      case 'invoice.payment_failed':
        return await handleInvoicePaymentFailed(event.data.object);
      
      case 'customer.subscription.deleted':
        return await handleSubscriptionDeleted(event.data.object);
      
      case 'customer.subscription.created':
        return await handleSubscriptionCreated(event.data.object);
      
      case 'customer.subscription.updated':
        return await handleSubscriptionUpdated(event.data.object);
      
      case 'charge.succeeded':
        return await handleChargeSucceeded(event.data.object);
      
      case 'payment_intent.succeeded':
        return await handlePaymentIntentSucceeded(event.data.object);
      
      default:
        console.log(`未处理的Webhook事件类型: ${event.type}`);
        return { success: true, message: '事件已接收但无需处理' };
    }
  } catch (error) {
    console.error('处理Webhook事件失败:', error);
    return { success: false, message: error instanceof Error ? error.message : '未知错误' };
  }
}

/**
 * 处理结账会话完成
 */
async function handleCheckoutSessionCompleted(session: any) {
  try {
    console.log('处理结账会话完成:', session.id);
    
    if (session.payment_status === 'paid') {
      // 1. 获取支付记录以找到用户ID
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      
      const { data: paymentRecord } = await supabase
        .from('genie_payment_records')
        .select('*')
        .eq('transaction_id', session.id)
        .single();
      
      if (paymentRecord) {
        // 2. 更新支付记录的客户ID
        await supabase
          .from('genie_payment_records')
          .update({
            customer_id: session.customer,
            updated_at: new Date().toISOString()
          })
          .eq('id', paymentRecord.id);
        
        console.log('已更新支付记录的客户ID:', {
          paymentRecordId: paymentRecord.id,
          userId: paymentRecord.user_id,
          stripeCustomerId: session.customer
        });
      }
      
      // 注释掉积分处理逻辑，避免重复添加积分
      // 订阅的积分由订阅Webhook处理，这里只处理支付记录更新
      /*
      // 检查是否为订阅支付，如果是则跳过handlePaymentSuccess（避免重复添加积分）
      const { data: existingCredits } = await supabase
        .from('genie_credit_balances')
        .select('subscription_credits')
        .eq('user_id', paymentRecord.user_id)
        .single();
      
      // 如果用户已有订阅积分，说明是订阅支付，跳过积分处理
      if (existingCredits && existingCredits.subscription_credits > 0) {
        console.log('检测到订阅支付，跳过积分处理，避免重复添加:', existingCredits.subscription_credits);
        return { success: true, message: '订阅支付处理完成，积分由订阅Webhook处理' };
      }
      
      // 非订阅支付，正常处理
      const result = await handlePaymentSuccess({
        sessionId: session.id,
        amount: session.amount_total,
        customerId: session.customer
      });
      
      if (result.success) {
        return { success: true, message: '支付成功处理完成' };
      } else {
        return { success: false, message: result.error || '支付成功处理失败' };
      }
      */
      
      // 简化处理：只更新支付记录，不处理积分
      return { success: true, message: '支付记录已更新，积分由订阅Webhook处理' };
    } else {
      return { success: true, message: '支付未完成，等待后续事件' };
    }
  } catch (error) {
    console.error('处理结账会话完成失败:', error);
    return { success: false, message: error instanceof Error ? error.message : '未知错误' };
  }
}

/**
 * 处理发票支付成功
 */
async function handleInvoicePaymentSucceeded(invoice: any) {
  try {
    console.log('处理发票支付成功:', invoice.id);
    
    // 这里可以处理订阅续费等情况
    // 暂时返回成功，具体逻辑可以根据需求扩展
    return { success: true, message: '发票支付成功处理完成' };
  } catch (error) {
    console.error('处理发票支付成功失败:', error);
    return { success: false, message: error instanceof Error ? error.message : '未知错误' };
  }
}

/**
 * 处理发票支付失败
 */
async function handleInvoicePaymentFailed(invoice: any) {
  try {
    console.log('处理发票支付失败:', invoice.id);
    
    // 这里可以处理支付失败的情况
    // 暂时返回成功，具体逻辑可以根据需求扩展
    return { success: true, message: '发票支付失败处理完成' };
  } catch (error) {
    console.error('处理发票支付失败失败:', error);
    return { success: false, message: error instanceof Error ? error.message : '未知错误' };
  }
}

/**
 * 处理订阅删除
 */
async function handleSubscriptionDeleted(subscription: any) {
  try {
    console.log('处理订阅删除:', subscription.id);
    
    // 1. 获取订阅信息
    const customerId = subscription.customer;
    const status = subscription.status;
    
    console.log('订阅删除详情:', {
      customerId,
      status,
      subscriptionId: subscription.id
    });
    
    // 2. 查找对应的用户
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    let userId: string | null = null;
    
    // 方法1: 通过customer_id查找支付记录
    const { data: paymentRecordByCustomer } = await supabase
      .from('genie_payment_records')
      .select('user_id')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (paymentRecordByCustomer) {
      userId = paymentRecordByCustomer.user_id;
      console.log('通过customer_id找到用户:', { userId, stripeCustomerId: customerId });
    } else {
      // 方法2: 查找最近的支付记录（作为备选方案）
      const { data: recentPaymentRecord } = await supabase
        .from('genie_payment_records')
        .select('user_id')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (recentPaymentRecord) {
        userId = recentPaymentRecord.user_id;
        console.log('通过最近支付记录找到用户:', { userId });
      }
    }
    
    if (!userId) {
      console.error('无法找到用户，Stripe客户ID:', customerId);
      return { success: false, message: '无法找到对应的用户' };
    }
    
    // 3. 重置用户为免费用户，积分重置为50
    // 同时更新genie_users表和genie_credit_balances表
    
    // 1. 更新genie_users表
    const { data: userRecord, error: updateUserError } = await supabase
      .from('genie_users')
      .update({
        current_credits: 50,
        total_earned_credits: 50,  // 总获得积分也重置为50
        current_plan: 'free',
        plan_status: 'inactive',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();
    
    if (updateUserError) {
      console.error('更新用户表失败:', updateUserError);
      return { success: false, message: '更新用户表失败' };
    }
    
    // 2. 更新genie_credit_balances表
    const { data: creditBalance, error: updateCreditError } = await supabase
      .from('genie_credit_balances')
      .upsert({
        user_id: userId,
        current_credits: 50,
        total_earned_credits: 50,
        subscription_credits: 0,
        last_transaction_id: crypto.randomUUID(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();
    
    if (updateCreditError) {
      console.error('更新积分余额表失败:', updateCreditError);
      return { success: false, message: '更新积分余额表失败' };
    }
    
    console.log('用户已重置为免费用户:', {
      userId,
      currentCredits: userRecord.current_credits,
      currentPlan: userRecord.current_plan,
      planStatus: userRecord.plan_status,
      creditBalance: creditBalance.current_credits
    });
    
    return { success: true, message: '订阅删除处理完成，用户已重置为免费用户，积分重置为50' };
  } catch (error) {
    console.error('处理订阅删除失败:', error);
    return { success: false, message: error instanceof Error ? error.message : '未知错误' };
  }
}

/**
 * 处理订阅更新
 */
async function handleSubscriptionUpdated(subscription: any) {
  try {
    console.log('处理订阅更新:', subscription.id);
    
    // 这里可以处理订阅变更的情况
    // 暂时返回成功，具体逻辑可以根据需求扩展
    return { success: true, message: '订阅更新处理完成' };
  } catch (error) {
    console.error('处理订阅更新失败:', error);
    return { success: false, message: error instanceof Error ? error.message : '未知错误' };
  }
}

/**
 * 处理订阅创建
 */
async function handleSubscriptionCreated(subscription: any) {
  try {
    console.log('处理订阅创建:', subscription.id);
    
    // 1. 获取订阅信息
    const customerId = subscription.customer;
    const priceId = subscription.items?.data?.[0]?.price?.id;
    const status = subscription.status;
    
    // 安全地解析Stripe时间戳
    let currentPeriodStart: Date;
    let currentPeriodEnd: Date;
    
    try {
      currentPeriodStart = new Date(subscription.current_period_start * 1000);
      currentPeriodEnd = new Date(subscription.current_period_end * 1000);
      
      // 验证时间是否有效
      if (isNaN(currentPeriodStart.getTime()) || isNaN(currentPeriodEnd.getTime())) {
        console.warn('Stripe时间戳无效，使用当前时间:', {
          current_period_start: subscription.current_period_start,
          current_period_end: subscription.current_period_end
        });
        currentPeriodStart = new Date();
        currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 默认30天后
      }
    } catch (error) {
      console.warn('解析Stripe时间戳失败，使用当前时间:', error);
      currentPeriodStart = new Date();
      currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 默认30天后
    }
    
    console.log('订阅详情:', {
      customerId,
      priceId,
      status,
      currentPeriodStart: currentPeriodStart.toISOString(),
      currentPeriodEnd: currentPeriodEnd.toISOString()
    });
    
    // 2. 根据价格ID获取产品信息以确定积分数量
    const product = await getProductByPriceId(priceId);
    if (!product) {
      console.error('根据价格ID未找到产品:', priceId);
      return { success: false, message: '产品不存在' };
    }
    
    console.log('产品信息:', product);
    
    // 3. 根据产品类型为用户添加积分
    if (product.credits > 0) {
      // 尝试多种方式查找用户
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      
      let userId: string | null = null;
      
      // 方法1: 通过customer_id查找支付记录
      const { data: paymentRecordByCustomer } = await supabase
        .from('genie_payment_records')
        .select('user_id')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (paymentRecordByCustomer) {
        userId = paymentRecordByCustomer.user_id;
        console.log('通过customer_id找到用户:', { userId, stripeCustomerId: customerId });
      } else {
        // 方法2: 通过价格ID查找最近的支付记录
        const { data: paymentRecordByPrice } = await supabase
          .from('genie_payment_records')
          .select('user_id')
          .eq('product_id', product.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (paymentRecordByPrice) {
          userId = paymentRecordByPrice.user_id;
          console.log('通过价格ID找到用户:', { userId, productId: product.id });
        } else {
          // 方法3: 查找最近的支付记录（作为最后的备选方案）
          const { data: recentPaymentRecord } = await supabase
            .from('genie_payment_records')
            .select('user_id')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
          
          if (recentPaymentRecord) {
            userId = recentPaymentRecord.user_id;
            console.log('通过最近支付记录找到用户:', { userId });
          }
        }
      }
      
      if (!userId) {
        console.error('无法找到用户，Stripe客户ID:', customerId, '产品ID:', product.id);
        return { success: false, message: '无法找到对应的用户' };
      }
      
      // 生成一个真正的UUID作为交易ID
      const transactionId = crypto.randomUUID();
      
      // 订阅时完全重置积分，不保留任何之前的积分（包括免费用户的50积分）
      // 同时更新genie_users表和genie_credit_balances表
      
      // 1. 更新genie_users表
      const { data: userRecord, error: updateUserError } = await supabase
        .from('genie_users')
        .update({
          current_credits: product.credits,        // 完全重置为产品积分
          total_earned_credits: product.credits,  // 完全重置为产品积分
          current_plan: product.plan_type,
          plan_status: 'active',
          plan_start_date: currentPeriodStart.toISOString(),  // 使用Stripe返回的订阅开始时间
          plan_end_date: currentPeriodEnd.toISOString(),      // 使用Stripe返回的订阅结束时间
          stripe_customer_id: customerId,  // 设置Stripe客户ID
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();
      
      if (updateUserError) {
        console.error('更新用户表失败:', updateUserError);
        return { success: false, message: '更新用户表失败' };
      }
      
      // 2. 更新genie_credit_balances表
      // 先尝试更新，如果记录不存在则创建
      let creditBalance;
      let updateCreditError;
      
      // 先尝试更新现有记录
      const { data: updatedCredit, error: updateError } = await supabase
        .from('genie_credit_balances')
        .update({
          current_credits: product.credits,        // 完全重置为产品积分
          total_earned_credits: product.credits,  // 完全重置为产品积分
          subscription_credits: product.credits,  // 完全重置为产品积分
          last_transaction_id: transactionId,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();
      
      if (updateError && updateError.code === 'PGRST116') {
        // 如果记录不存在，则创建新记录
        const { data: newCredit, error: insertError } = await supabase
          .from('genie_credit_balances')
          .insert({
            user_id: userId,
            current_credits: product.credits,        // 完全重置为产品积分
            total_earned_credits: product.credits,  // 完全重置为产品积分
            subscription_credits: product.credits,  // 完全重置为产品积分
            last_transaction_id: transactionId,
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
        
        if (insertError) {
          updateCreditError = insertError;
        } else {
          creditBalance = newCredit;
        }
      } else if (updateError) {
        updateCreditError = updateError;
      } else {
        creditBalance = updatedCredit;
      }
      
      if (updateCreditError) {
        console.error('更新积分余额表失败:', updateCreditError);
        return { success: false, message: '更新积分余额表失败' };
      }
      
      console.log('订阅积分设置成功:', {
        userId,
        currentCredits: userRecord.current_credits,
        currentPlan: userRecord.current_plan,
        planStatus: userRecord.plan_status,
        creditBalance: creditBalance.current_credits
      });
      
      return { success: true, message: '订阅创建处理完成，积分已设置为订阅产品积分' };
    }
    
    return { success: true, message: '订阅创建处理完成' };
  } catch (error) {
    console.error('处理订阅创建失败:', error);
    return { success: false, message: error instanceof Error ? error.message : '未知错误' };
  }
}

/**
 * 处理支付成功
 */
async function handleChargeSucceeded(charge: any) {
  try {
    console.log('处理支付成功:', charge.id);
    
    // 1. 获取支付信息
    const customerId = charge.customer;
    const amount = charge.amount / 100; // Stripe金额以分为单位
    const currency = charge.currency;
    const paymentMethod = charge.payment_method_details?.type;
    
    console.log('支付详情:', {
      customerId,
      amount,
      currency,
      paymentMethod
    });
    
    // 2. 查找对应的支付记录
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { data: paymentRecord } = await supabase
      .from('genie_payment_records')
      .select('*')
      .eq('transaction_id', charge.payment_intent)
      .single();
    
    if (paymentRecord) {
      console.log('找到支付记录:', paymentRecord);
      
      // 3. 更新支付记录状态
      const { error: updateError } = await supabase
        .from('genie_payment_records')
        .update({
          payment_status: 'succeeded',
          amount: amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentRecord.id);
      
      if (updateError) {
        console.error('更新支付记录失败:', updateError);
        return { success: false, message: '更新支付记录失败' };
      }
      
      console.log('支付记录状态更新成功');
      return { success: true, message: '支付成功处理完成，记录已更新' };
    } else {
      console.log('未找到对应的支付记录，可能已在其他事件中处理');
      return { success: true, message: '支付成功处理完成' };
    }
  } catch (error) {
    console.error('处理支付成功失败:', error);
    return { success: false, message: error instanceof Error ? error.message : '未知错误' };
  }
}

/**
 * 处理支付意图成功
 */
async function handlePaymentIntentSucceeded(paymentIntent: any) {
  try {
    console.log('处理支付意图成功:', paymentIntent.id);
    
    // 这里可以处理支付意图成功的情况
    // 比如更新支付状态、处理后续逻辑等
    // 暂时返回成功，具体逻辑可以根据需求扩展
    return { success: true, message: '支付意图成功处理完成' };
  } catch (error) {
    console.error('处理支付意图成功失败:', error);
    return { success: false, message: error instanceof Error ? error.message : '未知错误' };
  }
}

// 禁用Next.js的body解析，因为我们需要原始body来验证签名
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
