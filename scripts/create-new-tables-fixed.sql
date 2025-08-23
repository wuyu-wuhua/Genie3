-- =====================================================
-- 创建新的数据库表结构（修复版）
-- 适用于 Supabase PostgreSQL
-- 包含：产品表、支付记录表、积分余额表
-- =====================================================

-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. 产品表 (genie_products)
-- =====================================================

CREATE TABLE IF NOT EXISTS genie_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    plan_type VARCHAR(50) NOT NULL,
    credits INTEGER NOT NULL DEFAULT 0,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    price_id VARCHAR(255) UNIQUE,
    description TEXT,
    billing_cycle VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 添加产品表注释
COMMENT ON TABLE genie_products IS '产品套餐表';
COMMENT ON COLUMN genie_products.name IS '套餐名称';
COMMENT ON COLUMN genie_products.plan_type IS '套餐类型：basic, premium';
COMMENT ON COLUMN genie_products.credits IS '套餐积分数量';
COMMENT ON COLUMN genie_products.price IS '套餐价格';
COMMENT ON COLUMN genie_products.price_id IS '价格ID';
COMMENT ON COLUMN genie_products.billing_cycle IS '计费周期：monthly, yearly';

-- =====================================================
-- 2. 支付记录表 (genie_payment_records)
-- =====================================================

CREATE TABLE IF NOT EXISTS genie_payment_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    product_id UUID REFERENCES genie_products(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending',
    transaction_id VARCHAR(255) UNIQUE,
    credits_earned INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 添加支付记录表注释
COMMENT ON TABLE genie_payment_records IS '支付记录表';
COMMENT ON COLUMN genie_payment_records.user_id IS '用户ID';
COMMENT ON COLUMN genie_payment_records.product_id IS '产品ID';
COMMENT ON COLUMN genie_payment_records.amount IS '支付金额';
COMMENT ON COLUMN genie_payment_records.payment_status IS '支付状态';
COMMENT ON COLUMN genie_payment_records.credits_earned IS '获得的积分数量';

-- =====================================================
-- 3. 积分余额表 (genie_credit_balances)
-- =====================================================

CREATE TABLE IF NOT EXISTS genie_credit_balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,
    current_credits INTEGER NOT NULL DEFAULT 0,
    total_earned_credits INTEGER NOT NULL DEFAULT 0,
    subscription_credits INTEGER DEFAULT 0,
    last_transaction_id UUID,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 添加积分余额表注释
COMMENT ON TABLE genie_credit_balances IS '用户积分余额表';
COMMENT ON COLUMN genie_credit_balances.user_id IS '用户ID';
COMMENT ON COLUMN genie_credit_balances.current_credits IS '当前可用积分';
COMMENT ON COLUMN genie_credit_balances.total_earned_credits IS '总获得积分';

-- =====================================================
-- 5. 创建索引以提高查询性能
-- =====================================================

-- 产品表索引
CREATE INDEX IF NOT EXISTS idx_genie_products_plan_type ON genie_products(plan_type);
CREATE INDEX IF NOT EXISTS idx_genie_products_billing_cycle ON genie_products(billing_cycle);
CREATE INDEX IF NOT EXISTS idx_genie_products_price_id ON genie_products(price_id);

-- 支付记录表索引
CREATE INDEX IF NOT EXISTS idx_genie_payment_records_user_id ON genie_payment_records(user_id);
CREATE INDEX IF NOT EXISTS idx_genie_payment_records_product_id ON genie_payment_records(product_id);
CREATE INDEX IF NOT EXISTS idx_genie_payment_records_payment_status ON genie_payment_records(payment_status);
CREATE INDEX IF NOT EXISTS idx_genie_payment_records_transaction_id ON genie_payment_records(transaction_id);
CREATE INDEX IF NOT EXISTS idx_genie_payment_records_created_at ON genie_payment_records(created_at);

-- 积分余额表索引
CREATE INDEX IF NOT EXISTS idx_genie_credit_balances_user_id ON genie_credit_balances(user_id);

-- =====================================================
-- 8. 插入用户指定的套餐数据
-- =====================================================

-- 插入月付套餐
INSERT INTO genie_products (name, plan_type, credits, price, currency, price_id, description, billing_cycle) VALUES
('所有世界生成功能', 'basic', 2000, 39.90, 'USD', 'price_1Rxg9bP9YNEyAXtbiKJ68hN4', '月付基础套餐，包含所有世界生成功能', 'monthly'),
('所有高级功能', 'premium', 5000, 99.90, 'USD', 'price_1RxgABP9YNEyAXtbx1HMNYvg', '月付高级套餐，包含所有高级功能', 'monthly')
ON CONFLICT (price_id) DO NOTHING;

-- 插入年付套餐
INSERT INTO genie_products (name, plan_type, credits, price, currency, price_id, description, billing_cycle) VALUES
('所有世界生成功能年付', 'basic', 20000, 442.80, 'USD', 'price_1RxgX5P9YNEyAXtbBahS9mdG', '年付基础套餐，包含所有世界生成功能', 'yearly'),
('所有高级功能年付', 'premium', 50000, 838.80, 'USD', 'price_1RxgXTP9YNEyAXtb0t4nnfus', '年付高级套餐，包含所有高级功能', 'yearly')
ON CONFLICT (price_id) DO NOTHING;

-- =====================================================
-- 完成！
-- =====================================================

-- 所有表已成功创建，包括：
-- ✅ genie_products - 产品表
-- ✅ genie_payment_records - 支付记录表  
-- ✅ genie_credit_balances - 积分余额表

-- 套餐数据已插入：
-- 月付：所有世界生成功能 - $39.9/月 - 2000积分
-- 月付：所有高级功能 - $99.9/月 - 5000积分
-- 年付：所有世界生成功能 - $442.8/年 - 20000积分
-- 年付：所有高级功能 - $838.8/年 - 50000积分
