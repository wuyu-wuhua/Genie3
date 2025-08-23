import { loadStripe } from "@stripe/stripe-js";
import Stripe from "stripe";

// 客户端Stripe实例
export const getStripe = () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
};

// 服务器端Stripe实例
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: true,
});

export const STRIPE_CONFIG = {
  currency: "usd",
  // 产品定价配置 - 使用环境变量
  prices: {
    basic: {
      monthly: process.env.STRIPE_BASIC_MONTHLY_PRICE_ID!,
      yearly: process.env.STRIPE_BASIC_YEARLY_PRICE_ID!,
    },
    premium: {
      monthly: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID!,
      yearly: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID!,
    },
  },
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
} as const;

/**
 * 创建 Stripe Checkout 会话
 */
export async function createCheckoutSession({
  priceId,
  customerEmail,
  userId,
  productId,
  successUrl,
  cancelUrl,
  mode = 'subscription'
}: {
  priceId: string;
  customerEmail: string;
  userId: string;
  productId: string;
  successUrl: string;
  cancelUrl: string;
  mode?: 'subscription' | 'payment';
}) {
  try {
    const session = await stripe.checkout.sessions.create({
      mode,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: customerEmail,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        productId,
      },
      subscription_data: mode === 'subscription' ? {
        metadata: {
          userId,
          productId,
        },
      } : undefined,
    });

    return { success: true, sessionId: session.id, url: session.url };
  } catch (error) {
    console.error('创建Checkout会话失败:', error);
    return { success: false, error: error instanceof Error ? error.message : '未知错误' };
  }
}

/**
 * 创建 Stripe 客户门户会话
 */
export async function createCustomerPortalSession(
  customerId: string,
  returnUrl: string
) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    
    return { success: true, url: session.url };
  } catch (error) {
    console.error('创建客户门户会话失败:', error);
    return { success: false, error: error instanceof Error ? error.message : '未知错误' };
  }
}

/**
 * 获取Stripe客户信息
 */
export async function getStripeCustomer(customerId: string) {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    return { success: true, customer };
  } catch (error) {
    console.error('获取Stripe客户信息失败:', error);
    return { success: false, error: error instanceof Error ? error.message : '未知错误' };
  }
}

/**
 * 创建或更新Stripe客户
 */
export async function createOrUpdateStripeCustomer({
  email,
  userId,
  name
}: {
  email: string;
  userId: string;
  name?: string;
}) {
  try {
    // 先查找是否已存在客户
    const existingCustomers = await stripe.customers.list({
      email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      // 更新现有客户
      const customer = await stripe.customers.update(existingCustomers.data[0].id, {
        metadata: { userId },
        name,
      });
      return { success: true, customer, isNew: false };
    } else {
      // 创建新客户
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: { userId },
      });
      return { success: true, customer, isNew: true };
    }
  } catch (error) {
    console.error('创建或更新Stripe客户失败:', error);
    return { success: false, error: error instanceof Error ? error.message : '未知错误' };
  }
}
