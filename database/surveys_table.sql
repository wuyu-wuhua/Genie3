-- 创建surveys表
CREATE TABLE IF NOT EXISTS surveys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role TEXT NOT NULL,
  usecases TEXT[] NOT NULL,
  experience TEXT,
  interest INTEGER DEFAULT 0,
  selling TEXT[],
  concerns TEXT[],
  freq TEXT NOT NULL,
  price TEXT,
  fallback TEXT NOT NULL,
  integration TEXT[],
  env TEXT[],
  latency TEXT,
  magic TEXT,
  beta TEXT[],
  email TEXT,
  wechat TEXT,
  telegram TEXT,
  consent BOOLEAN DEFAULT false,
  region TEXT,
  lang TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_surveys_created_at ON surveys(created_at);
CREATE INDEX IF NOT EXISTS idx_surveys_role ON surveys(role);
CREATE INDEX IF NOT EXISTS idx_surveys_interest ON surveys(interest);
CREATE INDEX IF NOT EXISTS idx_surveys_consent ON surveys(consent);

-- 添加注释
COMMENT ON TABLE surveys IS '用户调研表单数据表';
COMMENT ON COLUMN surveys.role IS '用户在项目中的角色';
COMMENT ON COLUMN surveys.usecases IS '应用场景（数组）';
COMMENT ON COLUMN surveys.experience IS '使用类似工具的经验';
COMMENT ON COLUMN surveys.interest IS '兴趣评分（0-10）';
COMMENT ON COLUMN surveys.selling IS '最打动的卖点（数组）';
COMMENT ON COLUMN surveys.concerns IS '最担心的问题（数组）';
COMMENT ON COLUMN surveys.freq IS '理想使用频率';
COMMENT ON COLUMN surveys.price IS '可接受的价格范围';
COMMENT ON COLUMN surveys.fallback IS '对替代方案的态度';
COMMENT ON COLUMN surveys.integration IS '希望的接入方式（数组）';
COMMENT ON COLUMN surveys.env IS '设备与环境（数组）';
COMMENT ON COLUMN surveys.latency IS '可接受的延迟';
COMMENT ON COLUMN surveys.magic IS '最希望的魔法指令';
COMMENT ON COLUMN surveys.beta IS '内测参与意愿（数组）';
COMMENT ON COLUMN surveys.email IS '邮箱联系方式';
COMMENT ON COLUMN surveys.wechat IS '微信联系方式';
COMMENT ON COLUMN surveys.telegram IS 'Telegram联系方式';
COMMENT ON COLUMN surveys.consent IS '是否同意用于产品联络';
COMMENT ON COLUMN surveys.region IS '地区';
COMMENT ON COLUMN surveys.lang IS '语言偏好';
COMMENT ON COLUMN surveys.created_at IS '创建时间';
COMMENT ON COLUMN surveys.ip_address IS 'IP地址';
COMMENT ON COLUMN surveys.user_agent IS '用户代理';

-- 启用行级安全策略（RLS）
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许插入，但只允许管理员查看
CREATE POLICY "Allow insert for all users" ON surveys
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select for authenticated users only" ON surveys
  FOR SELECT USING (auth.role() = 'authenticated');

-- 创建视图用于统计分析
CREATE OR REPLACE VIEW survey_stats AS
SELECT 
  COUNT(*) as total_responses,
  COUNT(CASE WHEN consent = true THEN 1 END) as consented_contacts,
  AVG(interest) as avg_interest,
  COUNT(CASE WHEN interest >= 14 THEN 1 END) as high_interest_count,
  COUNT(CASE WHEN role = '开发者' THEN 1 END) as developer_count,
  COUNT(CASE WHEN role = '技术美术' THEN 1 END) as tech_artist_count,
  COUNT(CASE WHEN role = '设计师' THEN 1 END) as designer_count,
  COUNT(CASE WHEN role = '产品/运营' THEN 1 END) as product_count,
  COUNT(CASE WHEN role = '创作者' THEN 1 END) as creator_count,
  COUNT(CASE WHEN role = '学生' THEN 1 END) as student_count,
  COUNT(CASE WHEN role = '其他' THEN 1 END) as other_count
FROM surveys;

-- 创建函数用于获取热门选项
CREATE OR REPLACE FUNCTION get_popular_options()
RETURNS TABLE (
  category TEXT,
  option_value TEXT,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  -- 获取热门应用场景
  SELECT 'usecases'::TEXT, unnest(usecases) as option_value, COUNT(*) as count
  FROM surveys
  GROUP BY unnest(usecases)
  ORDER BY count DESC
  LIMIT 10;
  
  RETURN QUERY
  -- 获取热门卖点
  SELECT 'selling'::TEXT, unnest(selling) as option_value, COUNT(*) as count
  FROM surveys
  GROUP BY unnest(selling)
  ORDER BY count DESC
  LIMIT 10;
  
  RETURN QUERY
  -- 获取热门顾虑
  SELECT 'concerns'::TEXT, unnest(concerns) as option_value, COUNT(*) as count
  FROM surveys
  GROUP BY unnest(concerns)
  ORDER BY count DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;
