# 数据库设置说明

## 概述
本项目使用 Supabase 作为后端数据库服务。需要设置 surveys 表来存储用户调研表单数据。

## 环境变量配置
在项目根目录的 `.env.local` 文件中添加以下环境变量：

```bash
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 数据库表创建

### 方法1：使用 Supabase Dashboard
1. 登录 [Supabase Dashboard](https://app.supabase.com/)
2. 选择你的项目
3. 进入 SQL Editor
4. 复制 `surveys_table.sql` 文件中的内容
5. 执行 SQL 语句

### 方法2：使用 Supabase CLI
```bash
# 安装 Supabase CLI
npm install -g supabase

# 登录
supabase login

# 链接项目
supabase link --project-ref your_project_ref

# 运行迁移
supabase db push
```

## 表结构说明

### surveys 表字段
- `id`: 主键，UUID
- `role`: 用户角色（必填）
- `usecases`: 应用场景数组（必填）
- `experience`: 使用经验
- `interest`: 兴趣评分 0-10
- `selling`: 卖点数组
- `concerns`: 顾虑数组
- `freq`: 使用频率（必填）
- `price`: 价格接受范围
- `fallback`: 替代方案态度（必填）
- `integration`: 接入方式数组
- `env`: 环境数组
- `latency`: 延迟要求
- `magic`: 魔法指令
- `beta`: 内测参与数组
- `email`: 邮箱
- `wechat`: 微信
- `telegram`: Telegram
- `consent`: 同意条款
- `region`: 地区
- `lang`: 语言
- `created_at`: 创建时间
- `ip_address`: IP地址
- `user_agent`: 用户代理

## 安全策略
- 启用了行级安全策略（RLS）
- 所有用户都可以插入数据
- 只有认证用户才能查看数据
- 管理员可以通过 Supabase Dashboard 查看所有数据

## 统计分析
创建了以下视图和函数：
- `survey_stats`: 基础统计信息
- `get_popular_options()`: 获取热门选项

## 测试
创建表后，可以通过以下方式测试：

1. 访问生成器页面
2. 点击"提交用户调研表单"按钮
3. 填写并提交表单
4. 检查 Supabase Dashboard 中的数据

## 故障排除

### 常见问题
1. **环境变量未设置**: 确保 `.env.local` 文件存在且包含正确的值
2. **权限错误**: 检查 Supabase 项目的 API 密钥是否正确
3. **表不存在**: 确保已执行 `surveys_table.sql` 中的 SQL 语句

### 调试
- 检查浏览器控制台的错误信息
- 检查 Supabase Dashboard 的日志
- 验证 API 路由是否正确响应

## 数据导出
可以通过 Supabase Dashboard 导出数据：
1. 进入 Table Editor
2. 选择 surveys 表
3. 点击 Export 按钮
4. 选择导出格式（CSV, JSON 等）
