# 调研表单调试指南 V2

## 🚨 当前问题

用户反馈调研表单提交后无法保存到数据库，需要系统性地诊断和修复问题。

## ✅ 已修复的问题

1. **Supabase 导入路径错误** - 修复了 `@supabase/supabase/supabase-js` 的错误路径
2. **静态生成问题** - 添加了 `export const dynamic = 'force-dynamic'`
3. **增强的错误处理** - 添加了详细的日志和错误信息

## 🔍 调试步骤

### 步骤 1: 测试 Supabase 连接

访问测试端点来验证数据库连接：

```bash
# 在浏览器中访问
http://localhost:3000/api/survey/test-connection
```

**期望结果：**
```json
{
  "success": true,
  "message": "Supabase connection successful",
  "data": {
    "tableAccessible": true,
    "recordCount": 0
  }
}
```

### 步骤 2: 检查环境变量

访问环境变量检查端点：

```bash
http://localhost:3000/api/survey/check-env
```

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

### 步骤 3: 查看服务器日志

在终端中观察详细的日志输出：

```
=== Survey API called ===
Environment check: { supabaseUrl: '✅ Set', supabaseKey: '✅ Set' }
Request body: { "role": "开发者", "usecases": ["游戏原型"], ... }
📝 Inserting survey data: { ... }
🔗 Attempting database connection...
✅ Database insert successful
🎉 Survey submitted successfully: { ... }
=== Survey API completed ===
```

### 步骤 4: 检查浏览器控制台

1. 打开调研表单
2. 填写表单并提交
3. 查看控制台的错误信息
4. 查看网络请求的详细信息

## 🐛 常见问题诊断

### 问题 1: 环境变量未设置

**症状：** 环境变量检查显示"❌ 未设置"

**解决方案：**
1. 创建 `.env.local` 文件（如果不存在）
2. 添加以下内容：
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
3. 重启开发服务器

### 问题 2: 数据库表不存在

**症状：** 连接测试失败，显示表不存在

**解决方案：**
1. 在 Supabase Dashboard 中执行 `database/surveys_table.sql`
2. 确保表创建成功
3. 检查 RLS 策略配置

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

## 🧪 测试用例

### 测试 1: 基本连接测试

```bash
curl http://localhost:3000/api/survey/test-connection
```

### 测试 2: 环境变量检查

```bash
curl http://localhost:3000/api/survey/check-env
```

### 测试 3: 表单提交测试

1. 填写所有必填字段
2. 提交表单
3. 观察服务器日志
4. 检查数据库是否新增记录

## 📊 日志分析

### 成功提交的日志模式：

```
=== Survey API called ===
Environment check: { supabaseUrl: '✅ Set', supabaseKey: '✅ Set' }
Request body: { ... }
📝 Inserting survey data: { ... }
🔗 Attempting database connection...
✅ Database insert successful
🎉 Survey submitted successfully: { ... }
=== Survey API completed ===
```

### 失败的日志模式：

#### 环境变量问题：
```
Environment check: { supabaseUrl: '❌ Missing', supabaseKey: '❌ Missing' }
```

#### 验证失败：
```
❌ Validation failed: missing required fields
Validation details: { role: false, usecases: 0, freq: false, fallback: false }
```

#### 数据库连接失败：
```
❌ Database error: { code: '42P01', message: 'relation "surveys" does not exist' }
```

## 🚀 下一步行动

1. **立即测试**：访问 `/api/survey/test-connection` 验证连接
2. **检查环境变量**：访问 `/api/survey/check-env` 验证配置
3. **查看日志**：观察终端输出，寻找错误信息
4. **针对性修复**：根据具体错误进行修复

## 📞 获取帮助

如果问题仍然存在，请提供：

1. **连接测试结果**：`/api/survey/test-connection` 的响应
2. **环境变量检查结果**：`/api/survey/check-env` 的响应
3. **服务器日志**：终端中的完整错误日志
4. **浏览器控制台错误**：具体的错误信息

## 🔧 技术细节

### 修复的导入问题：
```typescript
// 错误 ❌
import { createClient } from '@supabase/supabase/supabase-js';

// 正确 ✅
import { createClient } from '@supabase/supabase-js';
```

### 添加的动态配置：
```typescript
export const dynamic = 'force-dynamic';
```

### 增强的错误处理：
```typescript
try {
  const { data, error } = await supabase
    .from('surveys')
    .insert([surveyData])
    .select();

  if (error) {
    console.error('❌ Database error:', error);
    // 详细的错误信息记录
  }
} catch (dbError) {
  console.error('❌ Database operation failed:', dbError);
  // 异常处理
}
```

现在请按照调试步骤进行测试，应该能够找到并解决问题！
