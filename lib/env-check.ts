// 环境变量检查工具
export function checkEnvironmentVariables() {
  const requiredVars = {
    'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };

  const optionalVars = {
    'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY,
  };

  const missingRequired = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  const missingOptional = Object.entries(optionalVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingRequired.length > 0) {
    console.error('❌ 缺少必需的环境变量:', missingRequired);
    console.error('请在 .env.local 文件中设置这些变量');
    return false;
  }

  if (missingOptional.length > 0) {
    console.warn('⚠️  缺少可选的环境变量:', missingOptional);
    console.warn('这些变量用于高级功能，缺少时某些功能可能受限');
  }

  console.log('✅ 环境变量检查通过');
  return true;
}

// 获取环境变量状态
export function getEnvironmentStatus() {
  return {
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasSupabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    isProduction: process.env.NODE_ENV === 'production',
  };
}

// 显示环境变量配置帮助
export function showEnvironmentHelp() {
  console.log(`
🔧 环境变量配置帮助

必需的环境变量:
- NEXT_PUBLIC_SUPABASE_URL: 你的Supabase项目URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY: 你的Supabase匿名密钥

可选的环境变量:
- SUPABASE_SERVICE_ROLE_KEY: 你的Supabase服务角色密钥（用于高级功能）

配置步骤:
1. 在项目根目录创建 .env.local 文件
2. 添加上述环境变量
3. 重启开发服务器

示例 .env.local 文件:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

注意: 服务角色密钥是可选的，缺少时某些功能会使用备用方案。
  `);
}
