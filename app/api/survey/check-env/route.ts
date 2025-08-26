import { NextResponse } from 'next/server';

// 强制动态渲染，避免静态生成问题
export const dynamic = 'force-dynamic';

export async function GET() {
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ 已设置' : '❌ 未设置',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ 已设置' : '❌ 未设置',
    NODE_ENV: process.env.NODE_ENV || '未设置'
  };

  return NextResponse.json({
    message: '环境变量检查',
    environment: envVars,
    timestamp: new Date().toISOString()
  });
}
