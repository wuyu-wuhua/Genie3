import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

// Stripe 配置，仅包含本项目需要暴露给门户的价格
const STRIPE_CONFIG = {
  currency: "usd",
  // Genie-3 项目价格配置
  prices: {
    basic_monthly: process.env.NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PRICE_ID,
    basic_yearly: process.env.NEXT_PUBLIC_STRIPE_BASIC_YEARLY_PRICE_ID,
    premium_monthly: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID,
    premium_yearly: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_YEARLY_PRICE_ID,
  },
} as const;

export async function POST(request: NextRequest) {
  try {
    const { customerEmail, returnUrl } = await request.json();

    if (!customerEmail) {
      return NextResponse.json(
        { error: 'Customer email is required' },
        { status: 400 }
      );
    }

    // 根据邮箱查找或创建Stripe客户
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: customerEmail,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      // 如果客户不存在，创建一个新客户
      customer = await stripe.customers.create({
        email: customerEmail,
        metadata: {
          source: 'genie3_portal',
        },
      });
    }

    // 获取本项目的价格ID列表
    const projectPriceIds = Object.values(STRIPE_CONFIG.prices).filter(Boolean) as string[];
    
    if (projectPriceIds.length === 0) {
      return NextResponse.json(
        { error: 'No valid price IDs configured' },
        { status: 400 }
      );
    }

    // 获取价格信息，了解产品结构
    const priceDetails = await Promise.all(
      projectPriceIds.map(async (priceId) => {
        const price = await stripe.prices.retrieve(priceId);
        return {
          id: priceId,
          product: price.product as string,
          interval: price.recurring?.interval,
          interval_count: price.recurring?.interval_count,
        };
      })
    );

    // 创建或复用客户门户配置
    let configuration: Stripe.BillingPortal.Configuration | undefined;

    const configurations = await stripe.billingPortal.configurations.list();
    if (configurations.data.length > 0) {
      const existingConfig = configurations.data[0];
      // 检查现有配置是否匹配
      const update = existingConfig.features?.subscription_update;
      const allowedPrices = projectPriceIds;
      const configuredPrices = update?.products?.[0]?.prices ?? [];

      const onlyAllowedPrices =
        configuredPrices.length > 0 &&
        configuredPrices.every((p) => allowedPrices.includes(p as string));

      if (onlyAllowedPrices) {
        configuration = existingConfig;
      }
    }

    if (!configuration) {
      // 创建新的客户门户配置
      // 关键：使用新的产品结构，重新启用subscription_update功能
      // 这次的产品结构应该完全符合Stripe规则
      
      // 使用新的产品结构：基础版和高级版，每个产品包含月付和年付
      const products = [
        {
          product: "prod_SuyKJYrFWydoym", // 基础版产品
          prices: [
            "price_1Rz8NxP9YNEyAXtbOCSc6WlE", // 基础版月付
            "price_1Rz8NxP9YNEyAXtbgHVKkFns"  // 基础版年付
          ]
        },
        {
          product: "prod_SuyLPUJvfrY6AM", // 高级版产品
          prices: [
            "price_1Rz8OsP9YNEyAXtb05RhgDmT", // 高级版月付
            "price_1Rz8OsP9YNEyAXtbss2JixgZ"  // 高级版年付
          ]
        }
      ];

      configuration = await stripe.billingPortal.configurations.create({
        business_profile: { 
          headline: "Genie 3 AI 3D World Generator - 管理您的订阅" 
        },
        features: {
          payment_method_update: { enabled: true },
          subscription_cancel: {
            enabled: true,
            mode: "at_period_end",
            cancellation_reason: {
              enabled: true,
              options: [
                "too_expensive",
                "missing_features",
                "switched_service",
                "unused",
                "other",
              ],
            },
          },
          subscription_update: {
            enabled: true,
            default_allowed_updates: ["price", "promotion_code"],
            products: products, // 使用新的产品结构
            proration_behavior: "create_prorations",
          },
          invoice_history: {
            enabled: true,
          },
          customer_update: {
            enabled: true,
            allowed_updates: ['email', 'address', 'phone', 'tax_id'],
          },
        },
        metadata: {
          allowed_price_ids: projectPriceIds.join(','),
          project: 'genie3',
          customer_id: customer.id,
          price_details: JSON.stringify(priceDetails),
          note: '使用新的产品结构：基础版和高级版，每个产品包含月付和年付，符合Stripe规则'
        }
      });
    }

    // 使用配置创建客户门户会话
    const portalSession = await stripe.billingPortal.sessions.create({
      configuration: configuration.id,
      customer: customer.id,
      return_url: returnUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/profile`,
    });

    return NextResponse.json({ 
      url: portalSession.url,
      customerId: customer.id,
      configurationId: configuration.id,
      projectPriceIds: projectPriceIds,
      products: priceDetails.map(price => ({
        productId: price.product,
        priceId: price.id,
        interval: price.interval,
        interval_count: price.interval_count
      })),
      message: '客户门户会话创建成功，每个产品一个价格避免计费周期冲突'
    });
  } catch (error) {
    console.error('Error creating portal session:', error);
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}
