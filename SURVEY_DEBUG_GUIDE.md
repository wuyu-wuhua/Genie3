# 调研表单调试指南

## 问题描述

用户反馈调研表单一直显示"提交失败"，需要诊断和修复问题。

## 已实施的修复

### 1. API 路由修复

- ✅ 添加了 `export const dynamic = 'force-dynamic'` 解决静态生成问题
- ✅ 改进了环境变量检查
- ✅ 添加了详细的日志记录
- ✅ 改进了错误处理和响应

### 2. 前端错误处理改进

- ✅ 添加了详细的错误信息显示
- ✅ 改进了控制台日志记录
- ✅ 显示具体的错误原因

## 调试步骤

### 步骤 1: 检查环境变量

访问 `/api/survey/check-env` 端点，检查环境变量是否正确设置：

```bash
curl http://localhost:3000/api/survey/check-env
```

或者直接在浏览器中访问：`http://localhost:3000/api/survey/check-env`

**期望结果：**
```json
{
  "message": "环境变量检查",
  "environment": {
    "NEXT_PUBLIC_SUPABASE_URL": "✅ 已设置",
    "SUPABASE_SERVICE_ROLE_KEY": "✅ 已设置",
    "NODE_ENV": "development"
  }
}
```

### 步骤 2: 检查浏览器控制台

1. 打开调研表单
2. 填写表单并提交
3. 查看浏览器控制台的错误信息
4. 查看网络请求的详细信息

### 步骤 3: 检查服务器日志

查看终端中的服务器日志，寻找：
- API 调用记录
- 请求体内容
- 数据库操作结果
- 错误信息

### 步骤 4: 测试数据库连接

确保 Supabase 数据库：
1. 表结构已正确创建
2. RLS 策略配置正确
3. 服务角色密钥有效

## 常见问题及解决方案

### 问题 1: 环境变量未设置

**症状：** 环境变量检查显示"❌ 未设置"

**解决方案：**
1. 检查 `.env.local` 文件是否存在
2. 确保包含以下变量：
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```
3. 重启开发服务器

### 问题 2: 数据库表不存在

**症状：** 日志显示"数据库存储失败"

**解决方案：**
1. 在 Supabase Dashboard 中执行 `database/surveys_table.sql`
2. 确保表创建成功
3. 检查 RLS 策略

### 问题 3: 权限问题

**症状：** 数据库操作被拒绝

**解决方案：**
1. 检查 RLS 策略配置
2. 确保使用正确的服务角色密钥
3. 验证数据库用户权限

### 问题 4: 网络请求失败

**症状：** 前端显示"提交失败"

**解决方案：**
1. 检查 API 路由是否正确
2. 验证请求格式
3. 检查 CORS 配置

## 测试用例

### 测试 1: 基本提交

1. 填写所有必填字段
2. 不填写联系方式
3. 提交表单
4. 验证成功消息

### 测试 2: 联系方式验证

1. 填写邮箱
2. 不勾选同意条款
3. 提交表单
4. 验证错误消息

### 测试 3: 可选字段

1. 只填写必填字段
2. 提交表单
3. 验证成功提交

## 日志分析

### 成功提交的日志示例：

```
Survey API called
Request body: { "role": "开发者", "usecases": ["游戏原型"], ... }
Inserting survey data: { "role": "开发者", "usecases": ["游戏原型"], ... }
Survey submitted successfully: { "id": "...", "role": "开发者", ... }
```

### 失败的日志示例：

```
Survey API called
Request body: { ... }
Validation failed: missing required fields
```

或

```
Survey API called
Request body: { ... }
Database error: { message: "relation 'surveys' does not exist" }
```

## 下一步行动

1. 运行环境变量检查
2. 查看服务器日志
3. 检查浏览器控制台
4. 根据具体错误信息进行针对性修复

## 联系支持

如果问题仍然存在，请提供：
1. 环境变量检查结果
2. 服务器日志
3. 浏览器控制台错误
4. 具体的错误消息
